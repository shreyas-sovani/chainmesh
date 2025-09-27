import ChainMeshActions from 0x7e7e90cac96ea9b1

// Creates a new on-chain scheduled task
// intervalSecs: seconds between callbacks
// startAt: current block time (UFix64 seconds)

transaction(intervalSecs: UInt64, startAt: UFix64) {
  let signerAddress: Address
  var adminRef: &ChainMeshActions.SchedulerAdmin?

  prepare(acct: auth(BorrowValue, SaveValue, StorageCapabilities, PublishCapability) &Account) {
    self.signerAddress = acct.address
    // Create admin resource and save it to storage
    if acct.storage.borrow<&ChainMeshActions.SchedulerAdmin>(from: ChainMeshActions.AdminStoragePath) == nil {
      let admin <- ChainMeshActions.createAdminResource()
      acct.storage.save(<-admin, to: ChainMeshActions.AdminStoragePath)
    }

    // Get a reference to the stored resource
    self.adminRef = acct.storage.borrow<&ChainMeshActions.SchedulerAdmin>(from: ChainMeshActions.AdminStoragePath)
  }
  execute {
    // Use the stored reference
    if let admin = self.adminRef {
      let _ = admin.createTask(intervalSecs: intervalSecs, startAt: startAt)
    } else {
      panic("admin not found")
    }
  }
}



