( function( globalContext, libraryName ) {
    "use strict";

    /**
     * @private
     * @type { object }
     */
    let libraryContext = new Object();

    /**
     * @private
     * @type { function }
     *
     * @param { * } firstValue  - The first value, which will be used for the comparison
     * @param { * } secondValue - The second value, which will be used for the comparsion
     * @returns { boolean } - Returns the boolean value, which indicates the comparison result
     */
    function equal( firstValue, secondValue ) {
        return firstValue === secondValue;
    }

    /**
     * @private
     * @type { function }
     *
     * @param { boolean } condition - The conidition, which will be used for the assertion
     * @param { string } message - The given message, which will be applied to the exception
     * @returns { undefined } - Nothing to return
     *
     * @throws { Error } - If the given condition value is NOT a type of `boolean`
     * @throws { Error } - If the given condition value is `false`
     */
    function assert( condition, message ) {
        if ( !equal( typeof condition, "boolean" ) )
            throw new Error( "Can't handle the given condition, because it's NOT a type of `boolean`." );

        if ( !equal( typeof message, "string" ) || equal( message, "" ) )
            message = "Unknown error has occured.";

        if ( !condition )
            throw new Error( message );
    }

    /**
     * @const
     * @private
     * @type { number }
     */
    const unit = 100;

    /**
     * @const
     * @private
     * @type { number }
     */
    const turnover = 2.0 * Math.PI;

    /**
     * @const
     * @private
     * @type { number }
     */
    const divisionFactor = 4.0;

    /**
     * @private
     * @type { ?number }
     */
    let lastTime = null;

    /**
     * @private
     * @type { symbol }
     */
    let $canvas  = Symbol( "Library::Canvas" );

    /**
     * @private
     * @type { symbol }
     */
    let $context = Symbol( "Library::Context" );

    /**
     * Main class, which provides the possibility to draw trigonometric
     * functions on the Canvas 2D rendering context
     *
     * @class Library
     */
    class Library {
        /**
         * @public
         * @constructor
         * @type { function }
         *
         * @returns { Library } - Returns a new instance of the `Library` class
         */
        constructor() {
            globalContext.addEventListener( "resize",
                resizeCanvasElement.bind( this )
            );
        }

        /**
         * @member { Library }
         * @public
         * @type { function }
         *
         * @param { string } domId - The DOM id of the canvas HTML element
         * @returns { undefined } - Nothing to return
         *
         * @throws { Error } - If the given DOM id is NOT a type of `string`
         */
        setCanvas( domId ) {
            assert( equal( typeof domId, "string" ),
                "The given DOM id is not a type of `string`."
            );

            handleCanvasElement.call( this, domId );
            initializeContext2d.call( this );
        }

        /**
         * @member { Library }
         * @public
         * @type { function }
         *
         * @returns { undefined } - Nothing to return
         */
        render() {
            handleRendererProcess.call( this );
        }
    }

    /**
     * @private
     * @type { function }
     *
     * @param { string } domId - The DOM id of the canvas HTML element
     * @returns { undefined } - Nothing to return
     *
     * @throws { Error } - Can't save the fetched DOM element as the canvas, because it's NOT an instance of `HTMLCanvasElement`
     */
    function handleCanvasElement( domId ) {
        let element = document.getElementById( domId );

        assert( element instanceof HTMLCanvasElement,
            "Can't handle the canvas element, because it's NOT an instance of `HTMLCanvasElement`."
        );

        element.width   = globalContext.innerWidth;
        element.height  = globalContext.innerHeight;
        this[ $canvas ] = element;
    }

    /**
     * @private
     * @type { function }
     *
     * @returns { undefined } - Nothing to return
     */
    function initializeContext2d() {
        this[ $context ] = this[ $canvas ].getContext( "2d" );
    }

    /**
     * @private
     * @type { function }
     *
     * @returns { undefined } - Nothing to return
     */
    function drawAxises() {
        let canvas  = this[ $canvas ];
        let context = this[ $context ];
        let axises = getAxisesValues.call( this );

        context.beginPath();
        context.moveTo( 0, axises.x );
        context.lineTo( canvas.width, axises.x );
        context.moveTo( axises.y, 0 );
        context.lineTo( axises.y, canvas.height );
        context.stroke();
    }

    /**
     * @private
     * @type { function }
     *
     * @returns { undefined } - Nothing to return
     */
    function drawSine() {
        let x = lastTime;
        let y = Math.sin( x );
        let canvas  = this[ $canvas ];
        let context = this[ $context ];
        let axises = getAxisesValues.call( this );

        context.beginPath();
        context.moveTo( axises.y, unit * y + axises.x );

        for ( let i = axises.y; i <= canvas.width; i++ ) {
            x = lastTime + ( -axises.y + i ) / unit;
            y = Math.sin( x );
            context.lineTo( i, unit * y + axises.x );
        }

        context.stroke();
    }

    /**
     * @private
     * @type { function }
     *
     * @returns { undefined } - Nothing to return
     */
    function drawCircle() {
        let context = this[ $context ];
        let axises = getAxisesValues.call( this );

        context.beginPath();
        context.moveTo( axises.y + unit, axises.x );
        context.arc( axises.y, axises.x, unit, 0, turnover, false );
        context.stroke();
    }

    /**
     * @private
     * @type { function }
     *
     * @returns { Object } - Returns the object, which contains the prepared width & height values for the X & X axises
     */
    function getAxisesValues() {
        return {
            x: Math.floor( this[ $canvas ].width / divisionFactor ),
            y: Math.floor( this[ $canvas ].height )
        };
    }

    /**
     * @private
     * @type { function }
     *
     * @returns { undefined } - Nothing to return
     */
    function handleRendererProcess() {
        lastTime = performance.now();
        this[ $context ].clearRect( 0, 0, this[ $canvas ].width, this[ $canvas ].height );

        drawAxises.call( this );
        drawSine.call( this );
        drawCircle.call( this );
        globalContext.requestAnimationFrame( handleRendererProcess.bind( this ) );
    }

    /**
     * @private
     * @type { function }
     *
     * @returns { undefined }
     */
    function resizeCanvasElement() {
        let canvas = this[ $canvas ];

        if ( canvas instanceof HTMLCanvasElement ) {
            canvas.width  = globalContext.innerWidth;
            canvas.height = globalContext.innerHeight;
        }
    }

    globalContext[ libraryName ] = Library;

})( window, "Chart" );