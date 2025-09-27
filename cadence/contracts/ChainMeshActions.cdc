access(all) contract ChainMeshActions {

  access(all) struct Task {
    access(all) let id: UInt64
    access(all) let intervalSecs: UInt64
    access(all) let nextRunAt: UFix64
    access(all) let enabled: Bool

    init(id: UInt64, intervalSecs: UInt64, nextRunAt: UFix64, enabled: Bool) {
      self.id = id
      self.intervalSecs = intervalSecs
      self.nextRunAt = nextRunAt
      self.enabled = enabled
    }
  }

  access(all) event TaskScheduled(id: UInt64, intervalSecs: UInt64)
  access(all) event TaskReady(id: UInt64, at: UFix64)
  access(all) event ExecutionReported(
    id: UInt64,
    evmChainId: UInt64,
    txHash: String,
    profit: UFix64,
    proofHash: String,
    publicSignalsHash: String
  )

  access(self) var lastTaskId: UInt64
  access(self) var tasks: {UInt64: Task}

  access(all) resource SchedulerAdmin {
    access(all) fun createTask(intervalSecs: UInt64, startAt: UFix64): UInt64 {
      let id = ChainMeshActions.lastTaskId + 1
      ChainMeshActions.lastTaskId = id
      let t = Task(id: id, intervalSecs: intervalSecs, nextRunAt: startAt, enabled: true)
      ChainMeshActions.tasks[id] = t
      emit TaskScheduled(id: id, intervalSecs: intervalSecs)
      return id
    }

    access(all) fun tick(now: UFix64) {
      for key in ChainMeshActions.tasks.keys {
        let t = ChainMeshActions.tasks[key]!
        if t.enabled && t.nextRunAt <= now {
          emit TaskReady(id: t.id, at: now)
          let next = now + UFix64(t.intervalSecs)
          let updatedTask = Task(id: t.id, intervalSecs: t.intervalSecs, nextRunAt: next, enabled: t.enabled)
          ChainMeshActions.tasks[key] = updatedTask
        }
      }
    }
  }

  access(all) resource Reporter {
    access(all) fun reportExecution(
      id: UInt64,
      evmChainId: UInt64,
      txHash: String,
      profit: UFix64,
      proofHash: String,
      publicSignalsHash: String
    ) {
      // Store light data on-chain; for MVP we emit event only
      emit ExecutionReported(
        id: id,
        evmChainId: evmChainId,
        txHash: txHash,
        profit: profit,
        proofHash: proofHash,
        publicSignalsHash: publicSignalsHash
      )
    }
  }

  access(all) let AdminStoragePath: StoragePath
  access(all) let ReporterStoragePath: StoragePath

  init() {
    self.tasks = {}
    self.lastTaskId = 0
    self.AdminStoragePath = /storage/ChainMeshActionsAdmin
    self.ReporterStoragePath = /storage/ChainMeshActionsReporter
  }

  access(all) fun getTasks(): [Task] {
    let arr: [Task] = []
    for key in self.tasks.keys {
      arr.append(self.tasks[key]!)
    }
    return arr
  }

  access(all) fun createAdminResource(): @SchedulerAdmin {
    return <- create SchedulerAdmin()
  }

  access(all) fun createReporterResource(): @Reporter {
    return <- create Reporter()
  }
}


