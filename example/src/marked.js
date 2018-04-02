const { $ } = global;
// Create reference instance
const myMarked = require('marked');

// Get reference
const renderer = new myMarked.Renderer();

renderer.link = function (href, title, text) {
    if (text === 'tigerface-embed') {
        return `<div id="${title}"></div><script src="${href}"></script>`;
    }
    return `<a href="${href}" title="${title}">${text}</a>`;
};

$(() => {
    $.get('hello.md', (md) => {
        const result = myMarked(md, { renderer });
        $('#root').html(result);
    });
});
