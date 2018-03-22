/**
 * @memberof module:tigerface-common
 * @param target
 * @param source
 */
export function copyProperties(target, source) {
    Reflect.ownKeys(source).forEach((key) => {
        if (key !== 'constructor'
            && key !== 'prototype'
            && key !== 'name'
        ) {
            const desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    });
}

/**
 * @memberof module:tigerface-common
 * @param target
 * @param mixins
 */
export function withMix(target, ...mixins) {
    mixins.forEach((mixin) => {
        copyProperties(target.prototype, mixin);
    });

    return target;
}

/**
 * @memberof module:tigerface-common
 * @param mixins
 */
export function mix(...mixins) {
    class Mix {
    }

    return withMix(Mix, mixins);
}

