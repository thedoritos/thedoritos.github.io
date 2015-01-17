---
layout: post
title: "2nd Week on 2015"
date: 2015-01-18 00:00:00
categories: unity xcode erros

---

## Errors on this week

### Could not load my custom framework

#### Message:

```
dyld: Library not loaded: @rpath/DoritosKit.framework/Doritoskit
  Referenced from: /private/var/mobile/Containers/Bundle/Application/XXXXXX-XXXXXX-XXXXX-XXXXX/myapp.app/myapp
  Reason: image not found
```

#### When:

Build project includes my custom framework.

#### Why:

The framework binary is not included on the build, although the header of the framework is imported.

#### How to solve it:

Add the framework into Embedded Binaries.

Parent Project > General > Embedded Binaries > Add ...

#### Other solutions (did not work in my case):

[http://stackoverflow.com/questions/24993752/os-x-framework-library-not-loaded-image-not-found](http://stackoverflow.com/questions/24993752/os-x-framework-library-not-loaded-image-not-found)

[http://stackoverflow.com/questions/24333981/ios-app-with-framework-crashed-on-device-dyld-library-not-loaded-xcode-6-beta](http://stackoverflow.com/questions/24333981/ios-app-with-framework-crashed-on-device-dyld-library-not-loaded-xcode-6-beta)

### MKMapView run out of render buffer

#### Message:

Unable to allocate render buffer storage!

#### When:

- Launch MKMapView which is keeped as a singleton instance
- Launch on iPhone 6 Plus

#### Why:

- MKMapView seems to allocate memory on every resizing
- And it seems to keep the all reference for a long time (or forever)
- iOS 8 on iPhone 6 Plus resizes views on load due to its resampling feature

### How to solve it (makeshift):

Do not resize MKMapView (if possible).

```
CGRect screenFrame = [[UIScreen mainScreen] bounds];
MKMapView *mapView = [[MKMapView alloc] initWithFrame:screenFrame];
```

### Appendix : Environment

OS X:

```
$ sw_vers
ProductName:	Mac OS X
ProductVersion:	10.10.1
BuildVersion:	14B25
```

Xcode: Version 6.1.1 (6A2008a)