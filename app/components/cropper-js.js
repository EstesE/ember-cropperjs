import Ember from 'ember';

export default Ember.Component.extend({
    croppable: false,
    roundedImage: null,
    isLoading: false,

    init: function () {
        var component = this;
        component._super(...arguments);
    },

    getRoundedCanvas(sourceCanvas) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var width = sourceCanvas.width;
        var height = sourceCanvas.height;

        canvas.width = width;
        canvas.height = height;

        context.imageSmoothingEnabled = true;
        context.drawImage(sourceCanvas, 0, 0, width, height);
        context.globalCompositeOperation = 'destination-in';
        context.beginPath();
        context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
        context.fill();

        return canvas;
    },

    didInsertElement() {
        let component = this;
        var image = document.getElementById('image');
        // var button = document.getElementById('button');
        // var result = document.getElementById('result');
        // var croppable = false;
        var cropper = new window.Cropper(image, {
            aspectRatio: 1,
            guides: true,
            scalable: true,
            zoomable: true,
            cropBoxResizable: true,
            checkOrientation: true,
            autoCrop: true,
            autoCropArea: 0.5,
            dragMode: 'move',
            viewMode: 1,
            ready: function () {
                component.croppable = true;
            }
        });
        this.set('cropper', cropper);

    },

    actions: {
        getData() {
            let component = this;
            let cropper = component.get('cropper');
            var croppedCanvas;
            var roundedCanvas;
            var roundedImage;

            if (!component.croppable) {
                return;
            }

            // Crop
            croppedCanvas = cropper.getCroppedCanvas({width: 300, height: 300});

            // Round
            roundedCanvas = this.getRoundedCanvas(croppedCanvas);

            // Show
            roundedImage = document.createElement('img');
            roundedImage.src = roundedCanvas.toDataURL();
            component.set('roundedImage', roundedImage);
        },

        handleFileSelect(file/*, resetInput*/) {
            let component = this;
            let reader = new FileReader();
            component.set('isLoading', true);
            reader.onload = function (event) {
                let data = event.target.result;
                component.set('isLoading', false);
                component.cropper.replace(data);
            };
            reader.readAsDataURL(file[0]);
        },
    }

});
