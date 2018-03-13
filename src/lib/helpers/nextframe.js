function nextFrame() {
    return new Promise(function(resolve, reject) {
        requestAnimationFrame(function() { resolve(); });
    });
}

nextFrame.mapInFrames = function(collection, fn) {
    var queue = Promise.resolve();
    var values = [];
    collection.forEach(item => {
        queue = queue.then(() => nextFrame().then(() => values.push(fn(item))));
    });
    return queue.then(() => values);
};

module.exports = nextFrame;
