/*jslint browser: true, indent: 4 */
//L'objet toile avec les méthodes de peinture etc..

var Crayon, Ligne, Rectangle, Cercle, Gomme, listenerMouseMove;

var Toile =  {

    canvas: null,
    context: null,
    tool: null,
    fillColor: null,
    shadowColor: null,
    shadowOffsetY: null,
    shadowOffsetX: null,
    shadowBlur: null,
    size: null,
    height: null,
    width: null,

    init: function () {

        "use strict";

        var that = this;
        this.canvas = document.getElementById('paint');
        this.height = this.canvas.height;
        this.width = this.canvas.width;
        this.context = this.canvas.getContext('2d');
        this.canvas.addEventListener('mousedown', function (e) {

            that.doDraw(e);

        });

        this.canvas.addEventListener('mouseup', function (e) {

            that.stopDraw(e);

        });

        this.canvas.addEventListener('mouseleave', function () {

            that.leave();

        });

        this.canvas.addEventListener('click', function (e) {

            that.doClick(e);

        });

        this.canvas.addEventListener('dblclick', function (e) {

            that.doDblClick(e);

        });

    },

    doDraw: function () {

        "use strict";

        if (this.tool === 'crayon') {

            Crayon.setContext(this.context);
            this.context.beginPath();
            Crayon.drawable = true;
            this.canvas.addEventListener('mousemove', function (e) {

                Crayon.doDraw(e);

            });

        } else if (this.tool === 'gomme') {

            Crayon.setContext(this.context);
            this.context.beginPath();
            Crayon.drawable = true;
            this.color = '#FFF';
            this.canvas.addEventListener('mousemove', function (e) {

                Crayon.doDraw(e);

            });


        }

    },

    doClear: function () {

        "use strict";

        this.context.clearRect(0, 0, this.width, this.height);

    },


    doClick: function (e) {

        "use strict";

        switch (this.tool) {

        case 'ligne':

            Ligne.setContext(this.context);
            Ligne.doDraw(e);
            break;

        case 'rectangle':

            Rectangle.setContext(this.context);
            Rectangle.doDraw(e);
            break;

        case 'cercle':

            Cercle.setContext(this.context);
            Cercle.doDraw(e);
            break;

        }

    },

    doDblClick: function (e) {

        "use strict";

        switch (this.tool) {

        case 'crayon':

            Crayon.setContext(this.context);
            Crayon.click(e);
            break;

        }

    },

    leave: function () {

        "use strict";

        Crayon.drawable = false;
        Gomme.drawable = false;
    },

    makeGrid: function (gridSize) {

        "use strict";

        var largeurCarre = this.width / gridSize,
            i = 0;

        for (i = 0; i < this.width; i += largeurCarre) {

            this.context.beginPath();
            this.context.strokeStyle = 'rgba(55,55,55, 0.3)';
            this.context.moveTo(i, 0);
            this.context.lineWidth = "2";
            this.context.lineTo(i, this.height);
            this.context.stroke();
            this.context.closePath();

        }

        for (i = 0; i < this.height; i += largeurCarre) {

            this.context.beginPath();
            this.context.strokeStyle = 'rgba(55,55,55, 0.3)';
            this.context.moveTo(0, i);
            this.context.lineWidth = "2";
            this.context.lineTo(this.width, i);
            this.context.stroke();
            this.context.closePath();

        }

        this.context.strokeStyle = '#000';
        this.context.lineWidth = "3";

    },

    doFillColor: function (bool) {

        "use strict";

        var that = this,
            toolFillColor = document.getElementById('toolFillColor');

        if (bool) {

            toolFillColor.addEventListener('input', function () {

                that.fillColor = this.value;

            });

        } else {

            this.fillColor = null;

        }

    },

    doShadow: function (bool) {

        "use strict";

        var that = this,
            toolShadowColor = document.getElementById('toolShadowColor'),
            shadowOffsetY = document.getElementById('shadowOffsetY'),
            shadowOffsetX = document.getElementById('shadowOffsetX'),
            shadowBlur = document.getElementById('shadowBlur');

        if (bool) {

            toolShadowColor.addEventListener('input', function () {

                that.shadowColor = this.value;

            });

            shadowOffsetX.addEventListener('change', function () {

                that.shadowOffsetX = this.value;

            });

            shadowOffsetY.addEventListener('change', function () {

                that.shadowOffsetY = this.value;

            });

            shadowBlur.addEventListener('change', function () {

                that.shadowBlur = this.value;

            });

        } else {

            this.context.shadowColor = null;
            this.context.shadowOffsetY = null;
            this.context.shadowOffsetX = null;
            this.context.shadowBlur = null;

            Toile.shadowColor = null;
            Toile.shadowOffsetY = null;
            Toile.shadowOffsetX = null;
            Toile.shadowBlur = null;

        }

    },

    stopDraw: function () {

        "use strict";

        if (this.tool === 'crayon') {

            Crayon.drawable = false;

        } else if (this.tool === 'gomme') {

            this.color = '#000';
            Crayon.drawable = false;

        }


    },

    getContext: function () {

        "use strict";

        return this.context;

    },

    setTool: function (toolName) {

        "use strict";

        this.tool = toolName;

    },

    setSize: function (size) {

        "use strict";

        this.size = size;

    },

    setColor: function (color) {

        "use strict";

        this.color = color;

    }

};

Crayon = {

    context: null,
    drawable: null,

    doDraw: function (e) {

        "use strict";

        if (this.drawable === true) {

            var x = e.pageX - Toile.canvas.offsetLeft,
                y = e.pageY - Toile.canvas.offsetTop;

            this.context.strokeStyle = Toile.color;
            this.context.lineWidth = Toile.size;

            this.context.lineTo(x, y);
            this.context.stroke();

        } else {

            this.context.closePath();

        }

    },

    click: function (e) {

        "use strict";

        var x = e.pageX - Toile.canvas.offsetLeft,
            y = e.pageY - Toile.canvas.offsetTop;

        this.context.strokeStyle = Toile.color;
        this.context.lineWidth = Toile.size;
        this.context.fillRect(x, y, Toile.size, Toile.size); // fill in the pixel at (10,10)
        this.context.stroke();
        this.context.closePath();

    },

    setContext: function (context) {

        "use strict";

        this.context = context;

    }

};

Ligne = {

    context: null,
    click: 0,

    doDraw: function (e) {

        "use strict";

        this.click += 1;
        var x = e.pageX - Toile.canvas.offsetLeft,
            y = e.pageY - Toile.canvas.offsetTop;

        if (this.click === 1) {

            this.context.beginPath();
            this.context.strokeStyle = Toile.color;
            this.context.moveTo(x, y);
            this.context.lineWidth = Toile.size;

        } else if (this.click === 2) {

            this.context.lineTo(x, y);
            this.context.stroke();
            this.context.closePath();
            this.click = 0;

        }

    },

    setContext: function (context) {

        "use strict";

        this.context = context;

    }

};

Rectangle = {

    context: null,
    click: 0,
    origin: {

        x: null,
        y: null

    },
    destination: {

        x: null,
        y: null

    },

    doDraw: function (e) {

        "use strict";

        this.click += 1;
        var x = e.pageX - Toile.canvas.offsetLeft,
            y = e.pageY - Toile.canvas.offsetTop,
            largeur,
            hauteur;

        if (this.click === 1) {

            this.origin.x = x;
            this.origin.y = y;

            this.context.beginPath();
            this.context.strokeStyle = Toile.color;
            this.context.lineWidth = Toile.size;

        } else if (this.click === 2) {

            this.destination.x = x;
            this.destination.y = y;

            largeur = this.destination.x - this.origin.x;
            hauteur = this.destination.y - this.origin.y;

            this.context.rect(this.origin.x, this.origin.y, largeur, hauteur);

            if (Toile.shadowColor) {

                this.context.shadowColor = Toile.shadowColor;
                this.context.shadowOffsetY = Toile.shadowOffsetY;
                this.context.shadowOffsetX = Toile.shadowOffsetX;
                this.context.shadowBlur = Toile.shadowBlur;

            }

            if (Toile.fillColor) {

                this.context.fillStyle = Toile.fillColor;
                this.context.fill();

            }

            this.context.stroke();
            this.context.closePath();
            this.click = 0;

        }

    },

    setContext: function (context) {

        "use strict";

        this.context = context;

    }

};

Cercle = {

    context: null,
    click: 0,
    origin: {

        x: null,
        y: null

    },
    destination: {

        x: null,
        y: null

    },

    doDraw: function (e) {

        "use strict";

        this.click += 1;
        var x = e.pageX - Toile.canvas.offsetLeft,
            y = e.pageY - Toile.canvas.offsetTop,
            rayon;

        if (this.click === 1) {

            this.origin.x = x;
            this.origin.y = y;

            this.context.beginPath();
            this.context.strokeStyle = Toile.color;
            this.context.lineWidth = Toile.size;

        } else if (this.click === 2) {

            this.destination.x = x;
            this.destination.y = y;

            rayon = Math.sqrt((this.destination.x - this.origin.x) * (this.destination.x - this.origin.x) + (this.destination.y - this.origin.y) * (this.destination.y - this.origin.y));

            this.context.arc(this.origin.x, this.origin.y, rayon, 0, 2 * Math.PI);

            if (Toile.fillColor) {

                this.context.fillStyle = Toile.fillColor;
                this.context.fill();

            }

            if (Toile.shadowColor) {

                this.context.shadowColor = Toile.shadowColor;
                this.context.shadowOffsetY = Toile.shadowOffsetY;
                this.context.shadowOffsetX = Toile.shadowOffsetX;
                this.context.shadowBlur = Toile.shadowBlur;

            }

            this.context.stroke();
            this.click = 0;

        }

    },

    setContext: function (context) {

        "use strict";

        this.context = context;

    }

};

Gomme = {

    context: null,
    drawable: null,

    doDraw: function (e) {

        "use strict";

        if (this.drawable === true) {

            var x = e.pageX - Toile.canvas.offsetLeft,
                y = e.pageY - Toile.canvas.offsetTop;

            this.context.strokeStyle = Toile.color;
            this.context.lineWidth = Toile.size;

            this.context.lineTo(x, y);
            this.context.stroke();

        } else {

            this.context.closePath();

        }

    },

    setContext: function (context) {

        "use strict";

        this.context = context;

    }

};

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    Toile.init();
    Toile.setTool('crayon');
    Toile.setSize('3');

    //VARIABLES !!

    var toolColor, toolFillColorLabel, toolFillColor, toolSize, ligne, crayon, rectangle, cercle, grille, gomme, clear, click = 0, shadowOffsetY, shadowOffsetX, toolShadowColor, shadowBlur, labelShadowColor, labelShadowOffsetY, labelShadowOffsetX, labelShadowBlur;

    //------------

    //SAC DE NOEUDS !!

    toolColor = document.getElementById("toolColor");
    toolFillColorLabel = document.getElementById('toolFillColorLabel');
    toolFillColor = document.getElementById('toolFillColor');
    toolSize = document.getElementById("toolSize");
    toolShadowColor = document.getElementById('toolShadowColor');
    shadowOffsetY = document.getElementById('shadowOffsetY');
    shadowOffsetX = document.getElementById('shadowOffsetX');
    shadowBlur = document.getElementById('shadowBlur');
    labelShadowColor = document.getElementById('labelShadowColor');
    labelShadowOffsetY = document.getElementById('labelShadowOffsetY');
    labelShadowOffsetX = document.getElementById('labelShadowOffsetX');
    labelShadowBlur = document.getElementById('labelShadowBlur');
    ligne = document.getElementById('ligne');
    crayon = document.getElementById('crayon');
    rectangle = document.getElementById('rectangle');
    clear = document.getElementById('clear');
    cercle = document.getElementById('cercle');
    grille = document.getElementById('grille');
    gomme = document.getElementById('gomme');

    //------------

    //ADDEVENTLISTENER LAND !!

    toolColor.addEventListener('input', function () {

        Toile.setColor(toolColor.value);

    });

    toolFillColorLabel.addEventListener('click', function () {

        click += 1;
        if (click === 1) {

            toolFillColor.style.display = "inline";
            Toile.fillColor = '#000';
            Toile.doFillColor(true);

        } else if (click === 2) {

            toolFillColor.style.display = "none";
            Toile.doFillColor(false);
            click = 0;

        }

    });

    toolSize.addEventListener('change', function () {

        Toile.setSize(toolSize.value);

    });

    labelShadowColor.addEventListener('click', function () {

        click += 1;
        if (click === 1) {

            toolShadowColor.style.display = "inline";
            shadowOffsetX.style.display = 'inline';
            shadowOffsetY.style.display = 'inline';
            shadowBlur.style.display = 'inline';
            labelShadowOffsetX.style.display = 'inline';
            labelShadowOffsetY.style.display = 'inline';
            labelShadowBlur.style.display = 'inline';
            Toile.shadowColor = '#000';
            Toile.shadowOffsetX = 5;
            Toile.shadowOffsetY = 5;
            Toile.shadowBlur = 5;
            Toile.doShadow(true);

        } else if (click === 2) {

            toolShadowColor.style.display = "none";
            shadowOffsetX.style.display = 'none';
            shadowOffsetY.style.display = 'none';
            shadowBlur.style.display = 'none';
            labelShadowOffsetX.style.display = 'none';
            labelShadowOffsetY.style.display = 'none';
            labelShadowBlur.style.display = 'none';

            click = 0;
            Toile.doShadow(false);

        }

    });

    ligne.addEventListener('click', function () {

        Toile.setTool('ligne');

    });

    crayon.addEventListener('click', function () {

        Toile.setTool('crayon');

    });

    rectangle.addEventListener('click', function () {

        Toile.setTool('rectangle');

    });

    cercle.addEventListener('click', function () {

        Toile.setTool('cercle');

    });

    grille.addEventListener('click', function () {

        Toile.makeGrid(35);

    });

    gomme.addEventListener('click', function () {

        Toile.setTool('gomme');
        Toile.doShadow(false);

    });

    clear.addEventListener('click', function () {

        Toile.setTool('crayon');
        Toile.doClear();

    });

});