// ServerEvents.commandRegistry(event => {
//     const commands = event.commands
//     const arguments = event.arguments
//     event.register(commands.literal("beebox").requires(src => src.hasPermission(2))
//         .then(commands.literal("structure_helper")
//             .then(commands.argument("center_pos", arguments.BLOCK_POS.create(event))
//                 .then(commands.argument("box_length", arguments.INTEGER.create(event))
//                     .then(commands.argument("box_height", arguments.INTEGER.create(event))
//                         .executes(ctx => {
//                             let level = ctx.source.level
//                             let centerPos = arguments.BLOCK_POS.getResult(ctx, "center_pos")
//                             let boxLength = arguments.INTEGER.getResult(ctx, "box_length")
//                             let boxHeight = arguments.INTEGER.getResult(ctx, "box_height")
//                             let bbb = new BeeBoxBuilder(level, centerPos).setBoxSize(boxLength, boxHeight)
//                             let boxPosScope = bbb.getBoxPosScope("all")
//                             let xScope = boxPosScope[0]
//                             let yScope = boxPosScope[1]
//                             let zScope = boxPosScope[2]
//                             bbb.setAllWallBlock("air").buildAllWalls(false)
//                             for(let y = yScope[0]; y <= yScope[1]; y++){
//                                 for(let x = xScope[0]; x <= xScope[1]; x++){
//                                     for(let z = zScope[0]; z <= zScope[1]; z++){
//                                         let result = bbb.findPosInBox(new BlockPos(x, y, z))
//                                         if(result.length > 0){continue}
//                                         let block = level.getBlock(new BlockPos(x, y, z))
//                                         block.set("air")
//                                     }
//                                 }
//                             }
//                         })
//                     )
//                 )
//             )
//         )
//     )
// })