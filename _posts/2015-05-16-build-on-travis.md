---
layout: post
title: "Travis CI で iOS アプリをビルドして DeployGate に配信するまで"
date: 2015-05-16 00:00:00
categories: iOS build
---

## 概要

GitHub の公開リポジトリでホストしている iOS アプリプロジェクトを Travis CI でビルドする。ビルドは、メインブランチに push がある度に自動で行う。ビルドした成果物は、DeployGate に自動で配信する。

## 参考

- [Travis CI for iOS - objc.io](http://www.objc.io/issue-6/travis-ci.html)

## 手順

- 証明書の準備
    - 証明書の取得
    - 証明書の暗号化
- プロジェクトの設定
- Travis プロジェクトの設定
- ビルド手順の設定
    - 証明書の復号化とインストール
    - ipa のビルド
    - DeployGate への配信
    - Slack への通知

## 証明書の準備

### 証明書の取得

- キーチェーンアクセスから書き出すもの
    - Apple Worldwide Developer Relations Certification Authority
    - iPhone Distribution Certificate
    - iPhone Distribution Private Key

- Apple Developer からダウンロードするもの
    - iOS Provisioning Profile

#### キーチェーンから証明書と秘密鍵を書き出す

1. キーチェーンアクセスを開く
1. 各項目を右クリックで export する
    - Travis/Certs/AppleWorldwideDeveloperRelationsCertificationAuthority.cer
        - スペース区切りを消しておく方がスクリプトが見やすい
    - Travis/Certs/Certificates.cer
    - Travis/Certs/Certificates.p12
        - 書き出し時に、秘密鍵用パスワードを設定する

#### Apple Developer からプロファイルをダウンロードする

1. ダウンロードして保存する
    - Travis/Certs/OakAdHoc.mobileprovision
    - プロファイルの種類は iOS Distribution であること

#### .travis.yml の設定

1. プロファイルを指定するために環境変数を設定しておく

    ```
    env:
      global:
      - APP_NAME="Oak"
      - DEVELOPER_NAME="iPhone Distribution: Tomohiro Matsumura"
      - PROFILE_NAME="OakAdHoc"  
    ```

1. Certificates.p12 用のパスワードを設定する

    ```
    travis encrypt "KEY_PASSWORD=yourpassword" --add
    ```

### 証明書の暗号化

公開リポジトリにアップするために、証明書や秘密鍵を暗号化する必要がある。

1. 暗号化用トークンを設定する

    ```
    travis encrypt "ENCRYPTION_TOKEN=yourtoken" --add
    ```

1. 暗号化する

    ```
    openssl aes-256-cbc -k "yourtoken" -in Travis/Certs/Certificates.cer -out Travis/Certs/Certificates.cer.encrypted -a
    openssl aes-256-cbc -k "yourtoken" -in Travis/Certs/Certificates.p12 -out Travis/Certs/Certificates.p12.encrypted -a
    openssl aes-256-cbc -k "yourtoken" -in Travis/Profiles/OakAdHoc.mobileprovision -out Travis/Profiles/OakAdHoc.mobileprovision.encrypted -a
    ```

#### リポジトリに追加する

.gitignore

```
Travis/Certs/**/*.*
!Travis/Certs/**/*.encrypted
Travis/Profiles/**/*.*
!Travis/Profiles/**/*.encrypted
!AppleWorldwideDeveloperRelationsCertificationAuthority.cer
```

## ビルド手順の設定

### 証明書の復号化とインストール

```
touch Travis/Scripts/setup_keychain.sh
chmod a+x Travis/Scripts/setup_keychain.sh
```

setup_keychain.sh

```
#!/bin/sh

# Decode certs
openssl aes-256-cbc -k ${ENCRYPTION_TOKEN} -in Travis/Certs/Certificates.cer.encrypted -d -a -out Travis/Certs/Certificates.cer
openssl aes-256-cbc -k ${ENCRYPTION_TOKEN} -in Travis/Certs/Certificates.p12.encrypted -d -a -out Travis/Certs/Certificates.p12
openssl aes-256-cbc -k ${ENCRYPTION_TOKEN} -in Travis/Profiles/${PROFILE_NAME}.mobileprovision.encrypted -d -a -out Travis/Profiles/${PROFILE_NAME}.mobileprovision

# Create default keychain on VM
# http://docs.travis-ci.com/user/common-build-problems/#Mac%3A-Code-Signing-Errors
security create-keychain -p travis ios-build.keychain
security default-keychain -s ios-build.keychain
security unlock-keychain -p travis ios-build.keychain
security set-keychain-settings -t 3600 -l ~/Library/Keychains/ios-build.keychain

# Add certs to keychain
security import ./Travis/Certs/AppleWorldwideDeveloperRelationsCertificationAuthority.cer -k ~/Library/Keychains/ios-build.keychain -T /usr/bin/codesign
security import ./Travis/Certs/Certificates.cer -k ~/Library/Keychains/ios-build.keychain -T /usr/bin/codesign
security import ./Travis/Certs/Certificates.p12 -k ~/Library/Keychains/ios-build.keychain -P ${KEY_PASSWORD} -T /usr/bin/codesign

# save profile
mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
cp "./Travis/Profiles/${PROFILE_NAME}.mobileprovision" ~/Library/MobileDevice/Provisioning\ Profiles/
```

### 証明書の削除（ビルド後）

```
touch Travis/Scripts/teardown_keychain.sh
chmod a+x Travis/Scripts/teardown_keychain.sh
```

teardown_keychain.sh

```
#!/bin/sh

security delete-keychain ios-build.keychain
rm -f "~/Library/MobileDevice/Provisioning Profiles/${PROFILE_NAME}.mobileprovision"
```

### ipa のビルド

Travis/Scripts/build_ipa.sh

```
#!/bin/sh

if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]; then
exit 0
fi
if [[ "$TRAVIS_BRANCH" != "develop" ]]; then
exit 0
fi

rm -rf ./build/*
xcodebuild -workspace ${APP_NAME}.xcworkspace -scheme ${APP_NAME} -sdk iphoneos -configuration Release CODE_SIGN_IDENTITY="${DEVELOPER_NAME}" archive -archivePath ./build/${APP_NAME}.xcarchive
xcodebuild -exportArchive -exportFormat IPA -archivePath ./build/${APP_NAME}.xcarchive -exportPath ./build/${APP_NAME}.ipa -exportProvisioningProfile "${PROFILE_NAME}"
```

プルリクエストやメインブランチ（develop）以外への更新は、ビルドしないようにする。

### DeployGate への配信

Travis/Scripts/upload_ipa.sh

```
#!/bin/sh

curl -F "file=@build/${APP_NAME}.ipa" -F "token=${DEPLOYGATE_API_KEY}" https://deploygate.com/api/users/${DEPLOYGATE_USER_NAME}/apps
```

API キーとユーザー名は、暗号化する。

```
travis encrypt "DEPLOYGATE_API_KEY=yourapikey" --add
travis encrypt "DEPLOYGATE_USER_NAME=yourusername" --add 
```

### Slack への通知

- [http://docs.travis-ci.com/user/notifications/#Slack-notifications](http://docs.travis-ci.com/user/notifications/#Slack-notifications)

```
travis encrypt "<account>:<token>" --add notifications.slack
```

### その他

API シークレットなど、公開リポジトリに含めたくないものは、スクリプトで作成する（のが最適な手段とは言っていない）。

_Travis/Scripts/create_secrets.sh_

```
#!/bin/sh

cat << EOS > Oak/Config/client_secret_generated.json
{
  "installed": {
    "auth_uri":"https://accounts.google.com/o/oauth2/auth",
    "client_secret":"${GOOGLE_API_CLIENT_SECRET}",
    "token_uri":"https://accounts.google.com/o/oauth2/token",
    "client_email":"",
    "redirect_uris":["urn:ietf:wg:oauth:2.0:oob","oob"],
    "client_x509_cert_url":"",
    "client_id":"${GOOGLE_API_CLIENT_ID}",
    "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs"
  }
}
EOS
```

例によって ID と SECRET は暗号化する。

```
travis encrypt "GOOGLE_API_CLIENT_ID=yourid" --add
travis encrypt "GOOGLE_API_CLIENT_SECRET=yoursecret" --add
```

## 感想

Travis CI で継続的にデプロイできるの便利。

あと、いつでも DeployGate から最新版をインストールできるので、実機を Mac に繋ぐことが無くなった。
