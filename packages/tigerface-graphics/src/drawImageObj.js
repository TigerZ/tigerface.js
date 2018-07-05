function drawImageObj(img, props = {}) {
    const {
        pos = { x: 0, y: 0 },
    } = props;

    const {
        clip = {
            x: 0,
            y: 0,
        },
    } = props;

    let {
        size,
    } = props;

    if (clip.x !== undefined && clip.x < 1) clip.x *= img.width;
    if (clip.y !== undefined && clip.y < 1) clip.y *= img.height;
    if (clip.width !== undefined && clip.width < 1) clip.width *= img.width;
    if (clip.height !== undefined && clip.height < 1) clip.height *= img.height;

    if (clip.x === undefined) clip.x = 0;
    if (clip.y === undefined) clip.y = 0;
    if (clip.width === undefined) clip.width = img.width - clip.x;
    if (clip.height === undefined) clip.height = img.height - clip.y;

    if (!size) {
        size = {
            width: clip.width,
            height: clip.height,
        };
    }

    this.drawImage(
        img,
        clip.x,
        clip.y,
        clip.width,
        clip.height,
        pos.x,
        pos.y,
        size.width,
        size.height,
    );
}

export default drawImageObj;
