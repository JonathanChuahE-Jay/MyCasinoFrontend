interface SlotMachineHeaderProps {

}

const SlotMachineHeader =
  ({}: SlotMachineHeaderProps) => {
    return (
      <div className="mb-8">
          <h1 className="display-title rise-in mb-1 text-3xl font-extrabold">
            Slot Machines
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose a machine and press Play to start spinning.
          </p>
        </div>
    )
  }

export default SlotMachineHeader