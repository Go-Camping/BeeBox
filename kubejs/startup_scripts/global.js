// priority: 1000
/**
 * @typedef {Object<string,number>} BeeBoxTiersPool
 */
/**
 * @type {Object<string,BeeBoxTiersPool>}
 */
global.BeeBoxTiersPools = {
    "t0" : {},
    "t1" : {},
    "t2" : {},
    "t3" : {},
    "t4" : {}
}
/**
 * @typedef {Object<string,number>} BeeBoxTypesPool
 */
/**
 * @type {Object<string,BeeBoxTypesPool>}
 */
global.BeeBoxTypesPools = {
    "default" : {},   // 空无之巢
    "start_box" : {},   // 伊始之巢
    "natural" : {}, // 自然之巢
    "putrefy" : {}, // 腐化之巢
}

/**
 * @typedef {Object<string,{path:string,weight:number,offset:BlockPos}>} StructuresTypesPool
 */
/**
 * @type {Object<string,StructuresTypesPool>}
 */
global.StructuresTypesPools = {
    "default" : {},   // 空无之巢
    "start_box" : {},   // 伊始之巢
    "natural" : {}, // 自然之巢
    "putrefy" : {}, // 腐化之巢
}