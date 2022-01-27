import Tower           from "./tower/Tower.js";
import AntiAirTower    from "./tower/AntiAirTower.js";
import BoostTower      from "./tower/BoostTower.js";
import EarthquakeTower from "./tower/EarthquakeTower.js";
import FastTower       from "./tower/FastTower.js";
import FrostTower      from "./tower/FrostTower.js";
import InkTower        from "./tower/InkTower.js";
import LaserTower      from "./tower/LaserTower.js";
import MissileTower    from "./tower/MissileTower.js";
import ShootTower      from "./tower/ShootTower.js";
import SnapTower       from "./tower/SnapTower.js";
import Mob             from "./mob/Mob.js";
import ArrowMob        from "./mob/ArrowMob.js";
import DarkMob         from "./mob/DarkMob.js";
import DecoyMob        from "./mob/DecoyMob.js";
import DecoyChild      from "./mob/DecoyChild.js";
import FastMob         from "./mob/FastMob.js";
import FlyingMob       from "./mob/FlyingMob.js";
import GroupMob        from "./mob/GroupMob.js";
import HopperMob       from "./mob/HopperMob.js";
import InmuneMob       from "./mob/InmuneMob.js";
import MorphMob        from "./mob/MorphMob.js";
import NormalMob       from "./mob/NormalMob.js";
import SpawnMob        from "./mob/SpawnMob.js";
import SpawnChild      from "./mob/SpawnChild.js";



/**
 * Creates a new Tower
 * @param {String} type
 * @param {...*}   params
 * @returns {Tower}
 */
function createTower(type, ...params) {
    const Tower = {
        Shoot      : ShootTower,
        Fast       : FastTower,
        Missile    : MissileTower,
        AntiAir    : AntiAirTower,
        Frost      : FrostTower,
        Earthquake : EarthquakeTower,
        Ink        : InkTower,
        Snap       : SnapTower,
        Laser      : LaserTower,
        Boost      : BoostTower
    };
    return new Tower[type](...params);
}

/**
 * Creates a new Mob
 * @param {String} type
 * @param {Object} data
 * @returns {Mob}
 */
function createMob(type, data) {
    const Mob = {
        Normal     : NormalMob,
        Inmune     : InmuneMob,
        Group      : GroupMob,
        Fast       : FastMob,
        Spawn      : SpawnMob,
        SpawnChild : SpawnChild,
        Flying     : FlyingMob,
        Arrow      : ArrowMob,
        Dark       : DarkMob,
        Decoy      : DecoyMob,
        DecoyChild : DecoyChild,
        Hopper     : HopperMob,
        Morph      : MorphMob
    };
    return new Mob[type](data);
}



// Public API
export default {
    createTower,
    createMob,
};
