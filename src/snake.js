/* eslint-disable no-var */
/* eslint-disable object-shorthand */
/* eslint-disable no-console */
/* eslint-disable no-console */
/* eslint-disable space-before-function-paren */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-template */
/* eslint-disable id-length */
/* eslint-disable quote-props */

// API
var snakeApi = {
    // Client config
    client: {
        // Check if client's bro is IE
        isIE: function () {
            var ua = window.navigator.userAgent;

            return (ua.indexOf('MSIE ') !== -1
                || ua.indexOf('Trident/') !== -1);
        },
        // Check if client's device is mobile
        isMobile: function () {
            return /Android|webOS|iPad|iPhone|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
                .test(navigator.userAgent);
        },
    },
    // Boolean type getters
    types: {
        isArray: function (array) {
            return (Array.isArray(array)
                || Object.prototype.isPrototypeOf.call(NodeList.prototype, array));
        },
        isBoolean: function (boolean) {
            return (boolean === true || boolean === false);
        },
        isElement: function (element) {
            return element instanceof Element;
        },
        isFunction: function (func) {
            return (typeof func === 'function');
        },
        isNumber: function (number) {
            return (typeof number === 'number');
        },
        isObject: function (obj) {
            return (typeof obj === 'object' && obj !== null);
        },
        isString: function (string) {
            return (typeof string === 'string');
        },
    },
    helpers: {
        // Get random integer from range
        randomizer: function(from, to) {
            return from + Math.round(Math.random() * (to - from));
        },
        // Get random coord from range
        getRandomSingleCoord: function(offset, gridDimensionSize) {
            var beg = offset;
            var end = gridDimensionSize;

            return snakeApi.helpers.randomizer(beg, end);
        },
        // Get random double-dimension coord from range
        getRandomDoubleCoord: function(xOffset, gridWidth, yOffset, gridHeight) {
            return {
                x: snakeApi.helpers.getRandomSingleCoord(xOffset, gridWidth),
                y: snakeApi.helpers.getRandomSingleCoord(yOffset, gridHeight),
            };
        },
        // Get block size in percent by current grid
        getBlockSize: function(gridWidth, gridHeight) {
            var isValidArguments = (gridWidth >= 1
                && gridHeight >= 1);

            var blockSize = {
                width: '',
                height: '',
            };

            if (!isValidArguments) {
                return blockSize;
            }

            blockSize.width = 'calc(' + (100 / gridWidth) + '%)';
            blockSize.height = 'calc(' + (100 / gridHeight) + '%)';

            return blockSize;
        },
        // Get block offset in percent by current grid and block coords
        getBlockOffset: function(gridWidth, gridHeight, coords) {
            var isValidArguments = snakeApi.types.isObject(coords)
                && coords.x
                && coords.y
                && gridWidth >= 1
                && gridHeight >= 1;

            var blockOffset = {
                left: '',
                top: '',
            };

            if (!isValidArguments) {
                return blockOffset;
            }

            blockOffset.left = 'calc(' + (100 / gridWidth) * (coords.x - 1) + '%)';
            blockOffset.top = 'calc(' + (100 / gridHeight) * (coords.y - 1) + '%)';

            return blockOffset;
        },
        // Get block's main params
        getBlockParams: function(type, coords, appSceneParams) {
            var blockSize = snakeApi.helpers.getBlockSize(appSceneParams.width, appSceneParams.height);
            var blockOffset = snakeApi.helpers.getBlockOffset(appSceneParams.width, appSceneParams.height, coords);

            var blockParams = {
                width: blockSize.width,
                height: blockSize.height,
                left: blockOffset.left,
                top: blockOffset.top,
                blockType: type,
            };

            return blockParams;
        },
        // Get all snake blocks
        getSnakeBlocks: function() {
            return document.querySelectorAll('snake');
        },
        // Guess what
        getSnakeHead: function() {
            return document.querySelector('snake.head');
        },
        getFoodBlock: function() {
            return document.querySelector('food');
        },
        // Get next snakeHead's coordinate by current direction
        getNextCoordsByDirection: function(coords, currentDirection) {
            var x = coords.x;
            var y = coords.y;

            if (currentDirection === 'up') {
                y -= 1;
            }

            if (currentDirection === 'down') {
                y += 1;
            }

            if (currentDirection === 'left') {
                x -= 1;
            }

            if (currentDirection === 'right') {
                x += 1;
            }

            return {
                newX: x,
                newY: y,
            };
        },
        // Check if current direction is from predefined values range
        isCurrentDirection: function(snakeParams) {
            return snakeParams.directions.some(function(dir) {
                return snakeParams.currentDirection === dir;
            });
        },
    },
    engine: {
        createBlockCoords: function(coords, repository) {
            var isValidArguments = snakeApi.types.isObject(coords)
                && coords.x
                && coords.y
                && snakeApi.types.isArray(repository);

            if (!isValidArguments) {
                return;
            }

            repository.push(coords);
        },
        drawBlock: function(appScene, blockParams) {
            var isValidArguments = snakeApi.types.isElement(appScene)
                && snakeApi.types.isObject(blockParams)
                && blockParams.width && snakeApi.types.isString(blockParams.width)
                && blockParams.height && snakeApi.types.isString(blockParams.height)
                && blockParams.left && snakeApi.types.isString(blockParams.left)
                && blockParams.top && snakeApi.types.isString(blockParams.top);

            if (!isValidArguments) {
                return;
            }

            if (!blockParams.blockType || !snakeApi.types.isString(blockParams.blockType)) {
                blockParams.blockType = 'div';
            }

            var block = document.createElement(blockParams.blockType);

            block.style.width = blockParams.width;
            block.style.height = blockParams.height;
            block.style.left = blockParams.left;
            block.style.top = blockParams.top;

            appScene.appendChild(block);
        },
        toggleHeadDirection: function(snakeHead, direction) {
            snakeHead.dataset.direction = direction;
        },
        checkDirection: function(snakeParams, direction) {
            var currentDirection = snakeParams.currentDirection;

            if (direction === currentDirection) {
                return false;
            }

            var upDis = (direction === 'up' && currentDirection === 'down');
            var downDis = (direction === 'down' && currentDirection === 'up');
            var leftDis = (direction === 'left' && currentDirection === 'right');
            var rightDis = (direction === 'right' && currentDirection === 'left');

            return (!upDis && !downDis && !leftDis && !rightDis);
        },
        switchCurrentDirection: function(snakeParams, direction) {
            var isValidDirection = snakeApi.engine.checkDirection(snakeParams, direction)
                && snakeParams.directions.some(function(dir) {
                    return dir === direction;
                });

            if (isValidDirection) {
                snakeParams.currentDirection = direction;

                var snakeHead = snakeApi.helpers.getSnakeHead();
                snakeApi.engine.toggleHeadDirection(snakeHead, direction);
            }
        },
        isNextSnakeStep: function(appScene, headCoords) {
            var x = headCoords.newX;
            var y = headCoords.newY;

            var disByEnv = appScene.enviromentObjects.some(function(obj) {
                return (obj.x === x && obj.y === y);
            });

            var disBySelf = appScene.snake.params.bodyCoords.some(function(obj) {
                return (obj.x === x && obj.y === y);
            });

            var allowedByGridSize = (x <= appScene.params.width && x >= 1) && (y <= appScene.params.height && y >= 1);

            return (!disByEnv && !disBySelf && allowedByGridSize);
        },
    },
};

function gameInit() {
    // Scene state
    var appScene = {
        params: {
            width: 20,
            height: 20,
            envObjects: 13,
            baseZoneLeftStart: 1,
            baseZoneTopStart: 1,
            baseZoneLeftOffset: 10,
            baseZoneTopOffset: 5,
        },
        enviromentObjects: [],
        foodObjects: [],
        snake: {
            params: {
                baseZone: [],
                bodyCoords: [],
                currentDirection: 'null',
                directions: ['right', 'down', 'left', 'up'],
                headCoords: {},
                defaultLength: 5,
                length: 5,
                defaultSpeed: 200,
                speed: 200,
            },
        },
    };

    // Scoped variables
    var engine = snakeApi.engine;
    var helpers = snakeApi.helpers;
    var types = snakeApi.types;
    var client = snakeApi.client;

    var appSceneContainer = document.querySelector('.app_scene');
    var appSceneParams = appScene.params;
    var snakeParams = appScene.snake.params;

    var snakeMoveTrigger = null;
    var gameOver = false;

    // Checking appscene's coordinates - a little bit of unreadable conditions
    // well it's gonna be at least somwhere in any code cause, you know, it's cool...
    // Check it out, it's misterious and you can read easily while others need their
    // attention not to just understand but understand wth is that for.
    // Pure monkey. It's priceless
    function isValidAppScene() {
        var isBaseXOffset = appSceneParams.baseZoneLeftStart >= 1
            && appSceneParams.baseZoneLeftOffset >= 1
            && ((appSceneParams.baseZoneLeftStart
                + appSceneParams.baseZoneLeftOffset)
                <= appSceneParams.width)
            && (snakeParams.length
                <= (appSceneParams.baseZoneLeftOffset
                - appSceneParams.baseZoneLeftStart));

        var isBaseYOffset = appSceneParams.baseZoneTopStart >= 1
            && appSceneParams.baseZoneTopOffset >= 1
            && ((appSceneParams.baseZoneTopStart
                + appSceneParams.baseZoneTopOffset)
                <= appSceneParams.height);

        return (isBaseXOffset && isBaseYOffset);
    }

    if (!isValidAppScene()) {
        console.log('invalid appScene settings');

        return false;
    }

    // Inserting enviroment objects blocks coords
    function createSnakeBaseZoneCoords() {
        for (var X = appSceneParams.baseZoneLeftStart;
            X <= appSceneParams.baseZoneLeftOffset;
            X++) {
            for (var Y = appSceneParams.baseZoneTopStart;
                Y <= appSceneParams.baseZoneTopOffset;
                Y++) {
                engine.createBlockCoords({ x: X, y: Y }, snakeParams.baseZone);
            }
        }
    }

    function checkIfCoordsExist(existingCoords, coordsToCheck) {
        return existingCoords.some(function(coords) {
            return coords.x === coordsToCheck.x && coords.y === coordsToCheck.y;
        });
    }

    function createSingleObjectCoords(options) {
        var coords = helpers.getRandomDoubleCoord(1, appSceneParams.width, 1, appSceneParams.height);

        var isDisabledByBaseZone = false;
        var isDisabledBySnake = false;
        var isDisabledByEnv = false;
        var isDisabledByFood = false;

        if (options.isBaseZoneException) {
            isDisabledByBaseZone = checkIfCoordsExist(snakeParams.baseZone, coords);
        }

        if (options.isSnakeException) {
            isDisabledBySnake = checkIfCoordsExist(snakeParams.bodyCoords, coords);
        }

        if (options.isEnvObjectsException) {
            isDisabledByEnv = checkIfCoordsExist(appScene.enviromentObjects, coords);
        }

        if (options.isFoodException) {
            isDisabledByFood = checkIfCoordsExist(appScene.foodObjects, coords);
        }

        if (!isDisabledByBaseZone
                && !isDisabledBySnake
                && !isDisabledByEnv
                && !isDisabledByFood) {
            engine.createBlockCoords(coords, options.store);

            return;
        }

        createSingleObjectCoords(options);
    }

    function createAllEnviromentObjectsCoords() {
        var envObjOptions = {
            isBaseZoneException: true,
            isSnakeException: false,
            isEnvObjectsException: true,
            isFoodException: false,
            store: appScene.enviromentObjects,
        };

        for (var num = 1; num <= appSceneParams.envObjects; num++) {
            createSingleObjectCoords(envObjOptions);
        }
    }

    function createEnviromentCoords() {
        createSnakeBaseZoneCoords();
        createAllEnviromentObjectsCoords();
    }

    // Drawing enviroment
    function drawEnviromentObjects() {
        Array.prototype.forEach.call(appScene.enviromentObjects, function(envObjCoords) {
            var blockParams = helpers.getBlockParams('obj', envObjCoords, appSceneParams);

            engine.drawBlock(appSceneContainer, blockParams);
        });
    }

    function drawEnviroment() {
        createEnviromentCoords();
        drawEnviromentObjects();
    }

    drawEnviroment();

    // Food logic
    function createFoodCoords() {
        var foodOptions = {
            isBaseZoneException: false,
            isSnakeException: true,
            isEnvObjectsException: true,
            isFoodException: true,
            store: appScene.foodObjects,
        };

        createSingleObjectCoords(foodOptions);
    }

    function drawFood() {
        var foodCoords = appScene.foodObjects[0];

        if (foodCoords) {
            var blockParams = helpers.getBlockParams('food', foodCoords, appSceneParams);

            engine.drawBlock(appSceneContainer, blockParams);
        }
    }

    function destroyFood() {
        if (appScene.foodObjects.length) {
            appScene.foodObjects = [];
        }

        var food = helpers.getFoodBlock();

        if (food) {
            food.parentNode.removeChild(food);
        }
    }

    function refreshFood() {
        destroyFood();
        createFoodCoords();
        drawFood();
    }

    // Inserting snake object blocks coords
    function createSnakeBodyCoords() {
        var Y = Math.floor(appSceneParams.baseZoneTopStart + (appSceneParams.baseZoneTopOffset / 2));
        var xStart = appSceneParams.baseZoneLeftStart;

        for (var X = (xStart + snakeParams.length - 1); X >= xStart; X--) {
            snakeParams.bodyCoords.push({ x: X, y: Y });
        }
    }

    // Drawing snake
    function setSnakeTransition(snakeBlocks) {
        Array.prototype.forEach.call(snakeBlocks, function(block) {
            block.style.transition = 'left ' + snakeParams.speed + 'ms linear, top ' + snakeParams.speed + 'ms linear';
            block.style['-webkit-transition'] = 'left ' + snakeParams.speed + 'ms linear, top ' + snakeParams.speed + 'ms linear';
            block.style['-ms-transition'] = 'left ' + snakeParams.speed + 'ms linear, top ' + snakeParams.speed + 'ms linear';
        });
    }

    function drawSnakeBodyObjects() {
        Array.prototype.forEach.call(snakeParams.bodyCoords, function(bodyObjCoords, index) {
            var blockParams = helpers.getBlockParams('snake', bodyObjCoords, appSceneParams);

            engine.drawBlock(appSceneContainer, blockParams);

            if (index === 0) {
                snakeParams.headCoords = {
                    x: bodyObjCoords.x,
                    y: bodyObjCoords.y,
                };
            }
        });

        var snakeBlocks = helpers.getSnakeBlocks();
        setSnakeTransition(snakeBlocks);
    }

    function drawSnake() {
        createSnakeBodyCoords();
        drawSnakeBodyObjects();
    }

    drawSnake();
    refreshFood();

    // Mark snake's blocks as variables
    var snakeBlocks = helpers.getSnakeBlocks();

    if (!snakeBlocks.length) {
        return false;
    }

    snakeBlocks[0].classList.add('head');

    // IE buttons control
    function getIEDirection(code) {
        var directionCodes = {
            '40': 'down',
            '39': 'right',
            '38': 'up',
            '37': 'left',
        };

        return (directionCodes[code.toString()] || '');
    }

    // Snake move logic
    document.addEventListener('keydown', function(e) {
        var isIe = client.isIE();
        var isDirection = !isIe
            ? e.code.includes('Arrow')
            : (Number(e.which) >= 37 && Number(e.which) <= 40);

        if (isDirection) {
            var direction = !isIe
                ? e.code.split('Arrow')[1].toLowerCase()
                : getIEDirection(e.which);

            engine.switchCurrentDirection(snakeParams, direction);
        }
    });

    function drawSnakeCurrentCoords() {
        Array.prototype.forEach.call(snakeBlocks, function(block, index) {
            var blockCoords = snakeParams.bodyCoords[index];
            var blockParams = helpers.getBlockParams('', blockCoords, appSceneParams);

            block.style.left = blockParams.left;
            block.style.top = blockParams.top;
        });
    }

    function stopMoving() {
        var isMoving = !(snakeMoveTrigger === null);

        if (isMoving) {
            clearInterval(snakeMoveTrigger);

            snakeMoveTrigger = null;
        }
    }

    function updateSnakeCoords() {
        if (helpers.isCurrentDirection(snakeParams)) {
            var currentHeadCoords = snakeParams.headCoords;
            var newHeadCoords = helpers.getNextCoordsByDirection(currentHeadCoords, snakeParams.currentDirection);
            var isNextStep = engine.isNextSnakeStep(appScene, newHeadCoords);

            if (!isNextStep) {
                stopMoving();

                gameOver = true;
                snakeParams.currentDirection = 'none';

                return;
            }

            var isFoodByNextStep = checkIfCoordsExist(appScene.foodObjects, {
                x: newHeadCoords.newX,
                y: newHeadCoords.newY,
            });

            if (!gameOver && isNextStep) {
                var newCoords = Array.prototype.reduce
                    .call(snakeParams.bodyCoords, function(newCoordsList, coord, index) {
                        if (index === 0) {
                            var nextStepCoords = {
                                x: newHeadCoords.newX,
                                y: newHeadCoords.newY,
                            };

                            newCoordsList.push(nextStepCoords);
                            snakeParams.headCoords = nextStepCoords;
                        } else if (snakeParams.bodyCoords[index - 1]) {
                            var newX = snakeParams.bodyCoords[index - 1].x;
                            var newY = snakeParams.bodyCoords[index - 1].y;

                            newCoordsList.push({
                                x: newX,
                                y: newY,
                            });
                        }

                        if (index === (snakeParams.bodyCoords.length - 1)
                            && isFoodByNextStep) {
                            var additionalBlockCoords = snakeParams.bodyCoords[snakeParams.bodyCoords.length - 1];

                            newCoordsList.push(additionalBlockCoords);

                            var blockParams = helpers.getBlockParams('snake', additionalBlockCoords, appSceneParams);
                            engine.drawBlock(appSceneContainer, blockParams);
                            snakeBlocks = helpers.getSnakeBlocks();
                            snakeParams.speed -= (snakeParams.speed * 0.05);
                            stopMoving();
                            startMoving();
                            setSnakeTransition(snakeBlocks);

                            refreshFood();
                        }

                        return newCoordsList;
                    }, []);

                snakeParams.bodyCoords = newCoords;

                drawSnakeCurrentCoords();
            }
        }
    }

    function startMoving() {
        if (snakeMoveTrigger === null) {
            snakeMoveTrigger = setInterval(function() {
                updateSnakeCoords();
            }, snakeParams.speed);
        }
    }

    startMoving();

    function destroyEnviroment() {
        appScene.enviromentObjects = [];
        snakeParams.baseZone = [];

        Array.prototype.forEach.call(document.querySelectorAll('obj'), function(obj) {
            obj.parentNode.removeChild(obj);
        });
    }

    function destroySnake() {
        snakeParams.headCoords = {};
        snakeParams.bodyCoords = [];

        Array.prototype.forEach.call(snakeBlocks, function(block) {
            block.parentNode.removeChild(block);
        });

        snakeBlocks = [];
    }

    function restartGame() {
        snakeParams.currentDirection = 'none';

        stopMoving();
        destroyEnviroment();
        destroySnake();

        snakeParams.speed = snakeParams.defaultSpeed;

        gameOver = false;

        drawEnviroment();
        drawSnake();
        refreshFood();
        snakeBlocks = helpers.getSnakeBlocks();
        snakeBlocks[0].classList.add('head');

        startMoving();
    }

    document.querySelector('.tool_panel').addEventListener('click', restartGame);

    return true;
}

gameInit();
