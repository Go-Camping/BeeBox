ItemEvents.rightClicked('forestry:bee_drone_ge', event =>{

    event.player.tell(new BeeNBT().readNBT(event.item.nbt).getHealth())

})