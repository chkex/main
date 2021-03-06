//
//  chkexViewController.m
//  Checkout Express
//
//  Created by Martin Jelin on 12/3/13.
//  Copyright (c) 2013 Checkout Express. All rights reserved.
//


#import "chkexViewController.h"
#import "KeychainItemWrapper.h"

@interface chkexViewController () <ESTBeaconManagerDelegate>
@property (nonatomic, strong) ESTBeaconManager* beaconManager;

@end

@implementation chkexViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    //Location
    locationDelegate = [[LocationDelegate alloc] init];
    [locationDelegate.locationManager startUpdatingLocation];

    //Bluetooth
    bluetoothIDs = nil;
    bluetoothRSSIs = nil;
//    bluetoothIDs = @[@"58844-63794"];//Light blue
//    bluetoothRSSIs = @[@0];

    self.beaconManager = [[ESTBeaconManager alloc] init];
    self.beaconManager.delegate = self;
    self.beaconManager.avoidUnknownStateBeacons = YES;
    ESTBeaconRegion* region = [[ESTBeaconRegion alloc] initRegionWithIdentifier:@"EstimoteSampleRegion"];
    [self.beaconManager startRangingBeaconsInRegion:region];
}

-(void)beaconManager:(ESTBeaconManager *)manager
     didRangeBeacons:(NSArray *)beacons
            inRegion:(ESTBeaconRegion *)region
{
    NSMutableArray *ids = [NSMutableArray array];
    NSMutableArray *rssis = [NSMutableArray array];
    for(ESTBeacon *beacon in beacons) {
        [ids addObject:[NSString stringWithFormat:@"%@-%@", beacon.major, beacon.minor]];
        [rssis addObject:[NSNumber numberWithInteger:beacon.rssi]];
    }
    bluetoothIDs = ids;
    bluetoothRSSIs = rssis;
}

- (NSString *) getInitialPageName
{
    return @"app.html";
}

- (NSDictionary *) processFunctionFromJS:(NSString *) name withArgs:(NSArray*) args error:(NSError **) error
{
    //Make sure the correct number of agrs were passed & that the function exists
    int numArgs;
    if([name isEqualToString:@"echo"])
        numArgs = 1;
    else if([name isEqualToString:@"getPos"])
        numArgs = 0;
    else if([name isEqualToString:@"getKeychain"])
        numArgs = 0;
    else if([name isEqualToString:@"setKeychain"])
        numArgs = 1;
    else if([name isEqualToString:@"getTableInfo"])
        numArgs = 0;
    else if([name isEqualToString:@"setTitleBar"])
        numArgs = 2;
    else {
        NSString *resultStr = [NSString stringWithFormat:@"Function '%@' not found", name];
        [self createError:error withCode:-1 withMessage:resultStr];
        return nil;
    }
    
    if(args.count != numArgs) {
        NSString *resultStr = [NSString stringWithFormat:@"Function '%@' expects %d arguments but received %d", name, numArgs, (int) args.count];
        [self createError:error withCode:-1 withMessage:resultStr];
        return nil;
    }
    
    NSDictionary *ret = nil;
    if([name isEqualToString:@"echo"])
        ret = [self jsAPI_echo: [args objectAtIndex:0]];
    else if([name isEqualToString:@"getPos"])
        ret = [self jsAPI_getPos];
    else if([name isEqualToString:@"getKeychain"])
        ret = [self jsAPI_getKeychain];
    else if([name isEqualToString:@"setKeychain"])
        ret = [self jsAPI_setKeychain: [args objectAtIndex:0]];
    else if([name isEqualToString:@"getTableInfo"])
        ret = [self jsAPI_getTableInfo];
    else if([name isEqualToString:@"setTitleBar"])
        ret = [self jsAPI_setTitleBar: [args objectAtIndex:0] withBack: [args objectAtIndex:1]];
    return ret;
}

- (NSDictionary *) jsAPI_echo:(NSString *) text
{
    return @{@"_": text};
}

- (NSDictionary *) jsAPI_getPos
{
    return @{@"latitude": [NSNumber numberWithDouble:locationDelegate.location.coordinate.latitude],
            @"longitude": [NSNumber numberWithDouble:locationDelegate.location.coordinate.longitude],
             @"accuracy": [NSNumber numberWithDouble:locationDelegate.location.horizontalAccuracy]};
}

- (NSDictionary *) jsAPI_getKeychain
{
    KeychainItemWrapper *kc = [[KeychainItemWrapper alloc] initWithIdentifier:@"id" accessGroup:nil];
    return @{@"_": [kc objectForKey:(__bridge id) kSecValueData]};
}

- (NSDictionary *) jsAPI_setKeychain:(NSString *) val
{
    KeychainItemWrapper *kc = [[KeychainItemWrapper alloc] initWithIdentifier:@"id" accessGroup:nil];
    [kc setObject:val forKey:(__bridge id) kSecValueData];
    return nil;
}

- (NSDictionary *) jsAPI_getTableInfo
{
    if(bluetoothIDs == nil)
        return @{};
    return @{@"ids": bluetoothIDs, @"rssis": bluetoothRSSIs};
}

- (NSDictionary *) jsAPI_setTitleBar:(NSString *) title withBack: (NSString *) back
{
    [navItem setTitle:title];
    //Back Button
    return nil;
}

- (void)viewDidLayoutSubviews {
    webView.frame = CGRectMake(0, 64, self.view.frame.size.width, self.view.frame.size.height-64);
}

-(void) goBack
{
    [webView goBack];
}

- (IBAction)refresh:(id)sender
{
    [webView reload];
}

//Disable landscape
- (NSUInteger) supportedInterfaceOrientations {
    // Return a bitmask of supported orientations. If you need more,
    // use bitwise or (see the commented return).
    return UIInterfaceOrientationMaskPortrait | UIInterfaceOrientationMaskPortraitUpsideDown;
}

@end
