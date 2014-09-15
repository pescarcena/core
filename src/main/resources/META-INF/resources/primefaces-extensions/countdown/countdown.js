/**
 * Primefaces Extension Countdown Widget
 *
 * @author f.strazzullo
 */
PrimeFacesExt.widget.Countdown = PrimeFaces.widget.BaseWidget.extend({

    init : function(cfg) {
        this._super(cfg);
        this.cfg = cfg;
        this.originalTimeout = cfg.timeout;
        this.currentTimeout = cfg.timeout;

        if(cfg.autoStart){
            this.start();
        }

        this.print();

	},
    print:function(){

        var value = this.currentTimeout;

        if(this.cfg.formatFunction){
            value = this.cfg.formatFunction(value);
        }else if(this.cfg.format){

            var format = this.cfg.format;

            if("percentage" === format){
                value = ((this.currentTimeout*100)/this.originalTimeout) + "%";
            }else if("human" === format){
                value = moment.duration(this.currentTimeout,'seconds').humanize();
            }else{
                value = moment.utc(moment.duration(this.currentTimeout,'seconds').asMilliseconds()).format(format);
            }
        }

        this.jq.html(value);
    },
    doStep: function(){
        this.currentTimeout--;
        this.print();
        if(this.cfg.ontimerstep){
            this.cfg.ontimerstep({
                current:this.currentTimeout,
                total:this.originalTimeout
            });
        }
    },
	start : function() {

        var that = this;

        that.interval = setInterval(function(){
            that.doStep();
            if(that.currentTimeout <= 0){
                if(that.cfg.listener){
                    that.cfg.listener();
                }
                if(that.cfg.ontimercomplete){
                    that.cfg.ontimercomplete();
                }
                if(that.cfg.singleRun){
                    clearInterval(that.interval);
                }else{
                    that.currentTimeout = that.originalTimeout;
                    that.print();
                }
            }
        }, 1000);
	},
    pause: function(){
        clearInterval(this.interval);
    },
    stop: function(silent){
        if(!silent && this.cfg.listener){
            this.cfg.listener();
        }
        if(this.cfg.ontimercomplete){
            this.cfg.ontimercomplete();
        }
        if(this.interval){
            clearInterval(this.interval);
        }

        this.currentTimeout = this.originalTimeout;

    }

});