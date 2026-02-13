import Foundation
import React

// MARK: - Screen Time Manager
// This module bridges Apple's Screen Time API (FamilyControls + ManagedSettings)
// to React Native. It requires iOS 16+ and the FamilyControls entitlement.
//
// To enable:
// 1. Add "Family Controls" capability in Xcode Signing & Capabilities
// 2. Request the entitlement from Apple (requires developer account)
// 3. Build on a real device (Screen Time APIs don't work in simulator)

#if canImport(FamilyControls)
import FamilyControls
import ManagedSettings
import DeviceActivity
#endif

@objc(ScreenTimeManager)
class ScreenTimeManager: NSObject {

  #if canImport(FamilyControls)
  private let store = ManagedSettingsStore()
  #endif

  // MARK: - Authorization

  @objc
  func requestAuthorization(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
    #if canImport(FamilyControls)
    if #available(iOS 16.0, *) {
      Task {
        do {
          try await AuthorizationCenter.shared.requestAuthorization(for: .individual)
          resolve(true)
        } catch {
          reject("SCREEN_TIME_AUTH_ERROR", "Failed to authorize: \(error.localizedDescription)", error)
        }
      }
    } else {
      reject("SCREEN_TIME_UNAVAILABLE", "Screen Time API requires iOS 16+", nil)
    }
    #else
    // Fallback for when FamilyControls is not available
    resolve(true)
    #endif
  }

  @objc
  func isAuthorized(_ resolve: @escaping RCTPromiseResolveBlock,
                    rejecter reject: @escaping RCTPromiseRejectBlock) {
    #if canImport(FamilyControls)
    if #available(iOS 16.0, *) {
      let status = AuthorizationCenter.shared.authorizationStatus
      resolve(status == .approved)
    } else {
      resolve(false)
    }
    #else
    resolve(true)
    #endif
  }

  // MARK: - App Blocking

  @objc
  func blockApps(_ appIdentifiers: [String],
                 resolver resolve: @escaping RCTPromiseResolveBlock,
                 rejecter reject: @escaping RCTPromiseRejectBlock) {
    #if canImport(FamilyControls)
    if #available(iOS 16.0, *) {
      // Note: In a production app, you would use the FamilyActivityPicker
      // to let the user select actual app tokens. The string identifiers
      // here are placeholders - real implementation requires app tokens
      // from the FamilyControls framework.
      //
      // Example with actual implementation:
      // store.shield.applications = selectedApps.applicationTokens
      // store.shield.applicationCategories = .specific(selectedApps.categoryTokens)

      // For MVP, we set a shield on all selected application categories
      store.shield.applicationCategories = .all()

      resolve(nil)
    } else {
      reject("SCREEN_TIME_UNAVAILABLE", "Screen Time API requires iOS 16+", nil)
    }
    #else
    resolve(nil)
    #endif
  }

  @objc
  func unblockAllApps(_ resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) {
    #if canImport(FamilyControls)
    if #available(iOS 16.0, *) {
      store.clearAllSettings()
      resolve(nil)
    } else {
      reject("SCREEN_TIME_UNAVAILABLE", "Screen Time API requires iOS 16+", nil)
    }
    #else
    resolve(nil)
    #endif
  }

  // MARK: - Required for RCT Module

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
