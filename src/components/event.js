class CPEvent
{
    /**
     * selectors used within this class
     */
    SELECTORS() {
        return {
            BODY        : 'body',
            FORM        : '.'+this.PREFIX+'-form',
            FIELDSET    : 'fieldset',
            MODAL       : '.'+this.PREFIX+'-modal',
            BUTTON      : '.'+this.PREFIX+'-button',
            TITLE       : 'input[name="event-title"]',
            END_TIME    : 'input[name="end-time"]',
            END_DATE    : 'input[name="end-date"]',
            START_DATE  : 'input[name="start-date"]',
            START_TIME  : 'input[name="start-time"]',
            ERROR_CONTAINER: '.'+this.PREFIX+'-error-container',
        }
    }

    /**
     * class names used within the component
     */
    CLASSNAMES() {
        return {
            CONTAINER   :   this.PREFIX+"-event-container",
            EVENT       :   this.PREFIX+"-event",
            LABEL       :   this.PREFIX+"-event-label",
            START       :   'start',
            END         :   'end'
        };
    }

    constructor(data, container, week, cellSelector, options)
    {
        var now = new Date();
        this.PREFIX = 'cp-ev';
        this.uniqueID = this.PREFIX+now.getTime()+''+Math.ceil(Math.random()*100);
        this.container = container;
        this.week = week;
        this.cellSelector = cellSelector;
        this.event = null;
        this.data = data;
        this.start = 
        this.options = $.extend({
            onClick: null
        }, options);

        // bind methods
        this.html = this.html.bind(this);
        this.render = this.render.bind(this);
        this.SELECTORS = this.SELECTORS.bind(this);
        this.CLASSNAMES = this.CLASSNAMES.bind(this);
        this.componentDidRender = this.componentDidRender.bind(this);
        this.reposition = this.reposition.bind(this);
        this.resize = this.resize.bind(this);
        this.set_start_end = this.set_start_end.bind(this);
        this.destroy = this.destroy.bind(this);
    }

    componentDidRender()
    {
        // reset/set event
        this.event = this.container.find('#'+this.uniqueID);
        // reset/set listeners
        this.listeners();
        // reposition event element
        this.reposition();
    }

    render()
    {
        // render event html
        this.container.append(this.html());
        // fire component did render function
        this.componentDidRender();
    }

    html()
    {
        return "<button class='"+this.CLASSNAMES().EVENT+"' id='"+this.uniqueID+"' title='"+this.title()+"'>"+
                "<span class='"+this.CLASSNAMES().LABEL+"'>"+this.data.title+"</span>"+
            "</button>";
    }

    title()
    {
        return this.data.title+' ('+this.data.startDate+' - '+this.data.endDate+')';
    }

    listeners()
    {
        // listen for clicks on 
        if(typeof this.options.onClick == 'function')
        {
            this.event.off('click', this.handle_on_click.bind(this));
            this.event.on('click', this.handle_on_click.bind(this));
        }
    }

    handle_on_click(ev)
    {
        this.options.onClick(this.data);
    }

    reposition()
    {
        this.set_start_end();
        var startDate = new Date(this.data.startDate);
        var endDate = new Date(this.data.endDate);
        var left = (this.start.offset().left) - this.container.offset().left;
        if(startDate.getTime() == parseInt(this.start.attr('data-date')))
        {
            left = left + 15;
        }
        this.event.css({marginLeft: left+'px'});
        this.resize();
    }

    resize()
    {
        var startDate = new Date(this.data.startDate);
        var endDate = new Date(this.data.endDate);
        var sizeStart = this.start.offset().left;
        var sizeEnd = (this.end.offset().left + this.end.outerWidth());

        if(startDate.getTime() == parseInt(this.start.attr('data-date')))
        {
            sizeStart = sizeStart + 15;
            if(!this.event.hasClass(this.CLASSNAMES().START))
            {
                this.event.addClass(this.CLASSNAMES().START);
            }
        }

        if(endDate.getTime() == parseInt(this.end.attr('data-date')))
        {
            sizeEnd = sizeEnd - 15;
            if(!this.event.hasClass(this.CLASSNAMES().END))
            {
                this.event.addClass(this.CLASSNAMES().END);
            }
        }
        var size = sizeEnd - sizeStart;
        // console.log(this.start);
        // console.log(this.end);
        // console.log('__________');
        this.event.css({width: size+'px'});
    }

    set_start_end()
    {
        var startDate   = new Date(this.data.startDate);
        var endDate     = new Date(this.data.endDate);
        var cells       = this.week.find(this.cellSelector);
        var start       = null;
        var end         = null;

        for( var i = 0; i < cells.length; i++ )
        {
            var cell        = cells.eq(i);
            var cellDate    = parseInt(cell.attr('data-date'));

            // set start element
            if(start == null)
            {
                start = (cellDate >= startDate.getTime() && cellDate <= endDate.getTime()) || 
                        cellDate == startDate.getTime() ? cell : null;
            }

            // set end element
            if(end == null)
            {
                if(
                    cells.length - 1 == i ||
                    cellDate == endDate.getTime()
                )
                {
                    end = cell;
                }
            }

            // stop when start and end have been selected
            if(start != null && end != null) break;
        }

        this.start  = start;
        this.end    = end;
    }

    destroy()
    {
        this.event.remove();
        this.event = null;
    }
   
}