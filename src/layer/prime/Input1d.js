import {Layer} from "./abstract/Layer";
import { ModelInitWidth } from "../../utils/Constant";
import {colorUtils} from "../../utils/ColorUtils";
import {NeuralQueue} from "../../elements/NeuralQueue";

function Input1d(config) {

	Layer.call(this, config);

	this.shape = undefined;
	this.width = undefined;
	this.height = 1;
	this.depth = 1;
	this.outputShape = undefined;

	this.loadLayerConfig(config);

	this.actualWidth = ModelInitWidth;
	this.actualHeight = ModelInitWidth / this.width * this.height;

	this.unitLength = this.actualWidth / this.width;

	this.fmCenter = {
		x: 0,
		y: 0,
		z: 0
	};

	this.layerType = "input1d";

}

Input1d.prototype = Object.assign(Object.create(Layer.prototype), {

	init: function(center, actualDepth, nextHookHandler) {

		this.center = center;
		this.actualDepth = actualDepth;
		this.nextHookHandler = nextHookHandler;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		this.initAggregationElement();

		this.scene.add(this.neuralGroup);

	},

	loadLayerConfig: function(layerConfig) {

		if (layerConfig !== undefined) {

			if (layerConfig.shape !== undefined) {

				this.shape = layerConfig.shape;
				this.width = layerConfig.shape[0];
				this.outputShape = [layerConfig.shape, 1];

			}

		} else {
			console.error("\"shape\" is required for input1d layer.");
		}

	},

	loadModelConfig: function(modelConfig) {

		if (this.color === undefined) {
			this.color = modelConfig.color.input1d;
		}

		if (this.relationSystem === undefined) {
			this.relationSystem = modelConfig.relationSystem;
		}

		if (this.textSystem === undefined) {
			this.textSystem = modelConfig.textSystem;
		}

	},

	assemble: function(layerIndex) {

		this.layerIndex = layerIndex;

		console.log("put first input1d layer into model.");

	},

	initAggregationElement: function() {

		let aggregationHandler = new NeuralQueue(
			this.width,
			this.actualWidth,
			this.actualHeight,
			this.color
		);

		aggregationHandler.setLayerIndex(this.layerIndex);

		this.aggregationHandler = aggregationHandler;
		this.neuralGroup.add(aggregationHandler.getElement());

		if (this.neuralValue !== undefined) {
			this.updateAggregationVis();
		}

	},

	updateValue: function(value) {

		this.neuralValue = value;

		let colors = colorUtils.getAdjustValues(value);

		this.aggregationHandler.updateVis(colors);

	},

	handleHoverIn: function(hoveredElement) {

		if (this.textSystem !== undefined && this.textSystem) {
			this.showText(hoveredElement);
		}

	},

	handleHoverOut: function() {

		if (this.textSystem !== undefined && this.textSystem) {
			this.hideText();
		}

	},

	showText: function(element) {

		if (element.elementType === "featureLine") {
			this.aggregationHandler.showText();
			this.textElementHandler = this.aggregationHandler;
		}

	},

	hideText: function() {

		if (this.textElementHandler !== undefined) {

			this.textElementHandler.hideText();
			this.textElementHandler = undefined;
		}

	}

});

export { Input1d };