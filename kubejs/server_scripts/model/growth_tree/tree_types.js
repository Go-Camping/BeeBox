global.ZenithCloudsTree = (level, rootPos) => {
    return new GrowthTree(level, rootPos, "kubejs:zenith_clouds_log")
    .setMaxTreeAge(50)
    .setLeaveBlock('minecraft:sculk')
}