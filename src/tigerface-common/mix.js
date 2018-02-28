export function mix(...mixins) {
    class Mix {}

    return withMix(Mix, mixins);
}

export function copyProperties(target, source) {
    for (let key of Reflect.ownKeys(source)) {
        //console.log(key);
        if ( key !== "constructor"
            && key !== "prototype"
            && key !== "name"
        ) {

            let desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
}

export function withMix(target, ...mixins) {
    for (let mixin of mixins) {
        copyProperties(target.prototype, mixin);
    }

    return target;
}