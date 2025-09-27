import ChainMeshActions from 0x7e7e90cac96ea9b1

transaction(now: UFix64) {
  let signerAddress: Address
  var adminRef: &ChainMeshActions.SchedulerAdmin?

  prepare(acct: auth(BorrowValue, SaveValue, StorageCapabilities, PublishCapability) &Account) {
    self.signerAddress = acct.address
    // Create admin resource if it doesn't exist
    if acct.storage.borrow<&ChainMeshActions.SchedulerAdmin>(from: ChainMeshActions.AdminStoragePath) == nil {
    if acct.storage.borrow<&ChainMeshActions.SchedulerAdmin>(from: ChainMeshActions.AdminStoragePath) == nil {
      let admin <- ChainMeshActions.createAdminResource()
      acct.storage.save(<-admin, to: ChainMeshActions.AdminStoragePath)
    }
    }

    // Get a reference to the stored resource
    self.adminRef = acct.storage.borrow<&ChainMeshActions.SchedulerAdmin>(from: ChainMeshActions.AdminStoragePath)
  }
  execute {
    // Use the stored reference
    if let admin = self.adminRef {
      admin.tick(now: now)
    } else {
      panic("admin not found")
    }
  }
}


