import { CanvasLayer, CanvasSprite, DomLayer, DomSprite } from 'tigerface-display';

export const Tag = {
    CanvasLayer: 'CanvasLayer',
    DomLayer: 'DomLayer',
    CanvasSprite: 'CanvasSprite',
    DomSprite: 'DomSprite',
    Sprite: 'Sprite',
};


export function displayObjectFactory(type, Clazz = undefined, dom = undefined) {
    let instance;
    if (type === Tag.CanvasLayer) {
        instance = new CanvasLayer({}, dom);
    } else if (type === Tag.CanvasSprite) {
        instance = new CanvasSprite();
    } else if (type === Tag.DomLayer) {
        instance = new DomLayer({}, dom);
    } else if (type === Tag.DomSprite) {
        instance = new DomSprite({}, dom);
    } else if (type === Tag.Sprite) {
        try {
            instance = new Clazz({}, dom);
        } catch (e) {
            throw new Error(`尝试初始化类时发生错误，clazz="${Clazz}"。指定 Tag 为 ${Tag.Sprite} 时，如果没指定 instance 参数，那么必须指定参数 clazz="为有效的类名"`);
        }
    }
    return instance;
}
