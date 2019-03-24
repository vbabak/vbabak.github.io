"use strict";var DomHelper={findOne:function(t){return document.querySelector(t)},findAll:function(t,e){return(e=e||document).querySelectorAll(t)},classExists:function(t,e){return t.classList.contains(e)},toggleClass:function(t,e){return t.classList.toggle(e)},addClass:function(t,e){return t.classList.add(e)},removeClass:function(t,e){return t.classList.remove(e)},setStyles:function(t,e){for(let i in e)t.style[i]=e[i]},setAttributes:function(t,e){for(let i in e)t.setAttribute(i,e[i])},getAttribute:function(t,e){return t.getAttribute(e)},createElementNS:function(t,e,i){let s=document.createElementNS(t,e);return i&&DomHelper.addClass(s,i),s},createElement:function(t,e){let i=document.createElement(t);return e&&DomHelper.addClass(i,e),i},createTextNode:function(t){return document.createTextNode(t)},deleteChildNodes:function(t,e){for(let i=0;i<e.length;i++)t.removeChild(e[i])}};function ChartMode(t,e){let i=DomHelper.findOne(t);if(!i)throw"Unknown node 'btn_selector': "+t;this.mode_btn=i;let s=DomHelper.findOne(e);if(!s)throw"Unknown node 'chart_container': "+e;this.container=s,this.night_class="night",this.event_type="click"}function isArray(t){return"function"==typeof t.unshift}function getArrayMax(t){let e=0;return t.length&&(e=t.reduce(function(t,e){return Math.max(t,e)})),e}function getArrayMin(t){let e=0;return t.length&&(e=t.reduce(function(t,e){return Math.min(t,e)})),e}function XAxisDateFormat(t,e){let i=new Date(t),s=null;if(s=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i.getMonth()]+" "+i.getDate(),void 0!==e){s=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][i.getDay()]+", "+s}return s}function XAxisDateFormatLong(t){return XAxisDateFormat(t,!0)}function YValRound(t){let e=t;return e=t>=1e9?1e9*(t/1e9).toFixed(1):t>=1e6?1e6*(t/1e6).toFixed(1):t>=1e3?1e3*(t/1e3).toFixed(1):10*Math.ceil(t/10)}function YAxisFormat(t){let e=t;return e=t>=1e9?(t/1e9).toFixed(1)+"B":t>=1e6?(t/1e6).toFixed(1)+"M":t>=1e3?(t/1e3).toFixed(1)+"k":YValRound(t)}function getObjLength(t){return Object.keys(t).length}function ChartMath(t,e){this.axis_x_space=t,this.axis_y_space=e}function Chart(t){if(this.ChartMath=new ChartMath(55,40),"object"!=typeof t)throw"'config' must be an 'object'";if("string"!=typeof t.container)throw"'config.container' must be a 'string'";let e=this.getDomHelper().findOne(t.container);if(!e)throw"Unknown node 'container': "+t.container;this.container=e,this.deley=1,this.config=t,this.chart=null,this.axis_container=null,this.circles_container=null,this.lines_container=null,this.pan_container=null,this.pan_interactive_container=null,this.data=[],this.x_data=[],this.x_data_sliced=[],this.y_data={},this.y_data_sliced={},this.namespace="",this.tooltip_title_formatter=null,this.axis_y_value_formatter=null,this.axis_title_formatters={},this.on_finish=null,this.y_min=null,this.y_min_real=null,this.y_max=null,this.y_max_real=null,this.x1_range=null,this.x2_range=null,this.svgns="http://www.w3.org/2000/svg",this.max_points=500,this.container_width=this.container.offsetWidth,this.container_height=this.container.offsetHeight,this.axis_padding=[30,50,270,50],this.pan_height=100,this.pan_fg_width=null,this.pan_fg_left=null,this.pan_x_space=12,this.pan_top_space=50,this.inter_line=null,this.tooltip=null,this.line_color="#cf6300",this.lines={},this.pan_lines={},this.finish_props={tooltip:!1,legend:!1,interactive:!1,lines:!1,pan:!1},this.y_inactive={},this.performance={},this.debug_mode=!1,this.lock_event=!1}ChartMode.prototype.init=function(){this.eventListener=this.switchDayMode.bind(this),this.mode_btn.addEventListener(this.event_type,this.eventListener)},ChartMode.prototype.switchDayMode=function(t){t.preventDefault(),t.stopPropagation(),DomHelper.toggleClass(this.mode_btn,this.night_class),DomHelper.toggleClass(this.container,this.night_class)},ChartMode.prototype.reset=function(){this.mode_btn.removeEventListener(this.event_type,this.eventListener),DomHelper.removeClass(this.mode_btn,this.night_class),DomHelper.removeClass(this.container,this.night_class)},ChartMath.prototype.getXRatio=function(t,e,i,s){let n,h,r,a;return h=s||this.axis_x_space,i<(n=Math.floor(t/h))&&(n=i),r=Math.ceil(i/n),{axis_x_num:n=Math.ceil(i/r),axis_x_step:r,x_ratio:a=t/i}},ChartMath.prototype.getYRatio=function(t,e,i,s,n){let h,r,a,o,l,d,p;return r=this.axis_y_space,{axis_y_num:h=Math.floor(e/r),axis_y_space:r,axis_y_step:a=n(a=Math.ceil(s/h)),y_axis_min_v:o=n(Math.min(i,0)),y_axis_max_v:l=n(s),y_ratio:d=(p=h*r)/(h*a-o),axis_y_last_pos:p}},ChartMath.prototype.getInitFGWidth=function(t,e){return t*(200/e)/100},Chart.prototype.setDebugMode=function(t){this.debug_mode=!!t},Chart.prototype.setPanHeight=function(t){this.pan_height=t},Chart.prototype.setChartPadding=function(t,e,i,s){this.axis_padding=[t,e,i,s]},Chart.prototype.onFinish=function(t){this.checkIsCallback(t),this.on_finish=t},Chart.prototype.finish=function(){for(let t in this.finish_props)if(!0!==this.finish_props[t])return!1;"function"==typeof this.on_finish&&(this.on_finish(),this.on_finish=null)},Chart.prototype.makeClassName=function(t){let e=t;return this.namespace&&(e=this.namespace+"-"+t),e},Chart.prototype.getDomHelper=function(){if(void 0===DomHelper)throw"'DomHelper' is undefined";return DomHelper},Chart.prototype.getDomHelper=function(){if(void 0===DomHelper)throw"'DomHelper' is undefined";return DomHelper},Chart.prototype.load=function(t){if(this.startTime("Chart.load"),this.data=[],"object"==typeof t){if("object"!=typeof t.columns)throw"Only array or object is supported.";this.validate(t),this.findMaxMin()}this.endTime("Chart.load",1)},Chart.prototype.findMaxMin=function(){let t=this.ChartMath.getXRatio(this.getPanWidth(),this.getPanHeight(),this.x_data.length,this.pan_x_space),e=this.ChartMath.getInitFGWidth(this.getPanWidth(),t.axis_x_step),i=null===this.pan_fg_width?e:this.pan_fg_width,s=null===this.pan_fg_left?this.getPanWidth()-i:this.pan_fg_left,n=Math.floor(this.x_data.length*(s/this.getPanWidth())),h=Math.floor(this.x_data.length*(s+i)/this.getPanWidth()),r=null,a=null,o=null,l=null;for(let t in this.y_data)this.y_inactive[t]||"line"===this.data.types[t]&&(null===r?(r=getArrayMin(this.y_data[t]),o=getArrayMin(this.y_data[t])):(r=Math.min(r,getArrayMin(this.y_data[t].slice(n,h))),o=Math.min(o,getArrayMin(this.y_data[t].slice(1)))),a=Math.max(a,getArrayMax(this.y_data[t].slice(n,h))),l=Math.max(l,getArrayMax(this.y_data[t].slice(1))));this.y_min=r,this.y_min_real=o,this.y_max=a,this.y_max_real=l,this.x1_range=n,this.x2_range=h,this.loadXYData()},Chart.prototype.validate=function(t){let e=["columns","types","names","colors"];for(let i in e)if("object"!=typeof t[e[i]])throw new Error("'"+i+"' undefined");let i="";for(let e in t.types)"x"===t.types[e]&&(i=e);if(!i)throw"Column 'x' not specified";let s=0;for(let e in t.columns){if(void 0===t.types[t.columns[e][0]])throw"type '"+t.columns[e][0]+"' not specified";if(s){if("line"===t.types[t.columns[e][0]]&&s!==t.columns[e].length)throw new RangeError("Number of line points on axis does not match")}else s=t.columns[e].length;if(t.columns[e].length>this.max_points)throw new Error("columns['"+e+"'] exceed max points ("+this.max_points+")");t.columns[e][0]===i?this.x_data=t.columns[e].slice(1):this.y_data[t.columns[e][0]]=t.columns[e].slice(1)}this.data=t},Chart.prototype.loadXYData=function(){this.x_data_sliced=this.x_data.slice(this.x1_range,this.x2_range+1);for(let t in this.y_data)this.y_data_sliced[t]=this.y_data[t].slice(this.x1_range,this.x2_range+1)},Chart.prototype.checkIsCallback=function(t){if("function"!=typeof t)throw new Error("'callback' must be a function")},Chart.prototype.setAxisTitleFormatter=function(t,e){this.checkIsCallback(e),this.axis_title_formatters[t]=e},Chart.prototype.setYValueFormatter=function(t){this.checkIsCallback(t),this.axis_y_value_formatter=t},Chart.prototype.formatYValue=function(t){return"function"==typeof this.axis_y_value_formatter?this.axis_y_value_formatter(t):t},Chart.prototype.formatTitle=function(t,e){return"function"==typeof this.axis_title_formatters[t]?this.axis_title_formatters[t](e):e},Chart.prototype.setTooltipTitleFormatter=function(t){this.checkIsCallback(t),this.tooltip_title_formatter=t},Chart.prototype.formatTooltipTitle=function(t){return"function"==typeof this.tooltip_title_formatter?this.tooltip_title_formatter(t):t},Chart.prototype.draw=function(){this.startTime("Chart.draw");let t=this.getDomHelper().createElementNS(this.svgns,"svg",this.makeClassName("chart-root")),e=this.getDomHelper().createElementNS(this.svgns,"g","axis");this.axis_container=e;setTimeout(function(){this.addXAxis(e)}.bind(this),this.deley);setTimeout(function(){this.addYAxis(e)}.bind(this),this.deley);let i=this.getDomHelper().createElementNS(this.svgns,"g","chart-lines"),s=this.getDomHelper().createElementNS(this.svgns,"g","lines-circles");setTimeout(function(){this.addChartLines(i,s)}.bind(this),this.deley),this.lines_container=i,this.circles_container=s;let n=this.getDomHelper().createElementNS(this.svgns,"g","axis-interactive");this.inter_line=this.getDomHelper().createElementNS(this.svgns,"line"),n.appendChild(this.inter_line),t.appendChild(n),t.appendChild(e),t.appendChild(i),t.appendChild(s);let h=this.getDomHelper().createElementNS(this.svgns,"g");if(setTimeout(function(){this.makeAxisInteractiveRect(h),t.appendChild(h),this.finish_props.interactive=!0,this.finish()}.bind(this),this.deley),this.chart)this.container.replaceChild(t,this.chart);else{this.pan_container=this.getDomHelper().createElementNS(this.svgns,"g"),this.pan_interactive_container=this.getDomHelper().createElement("div","pan-interactive"),this.getDomHelper().setAttributes(this.pan_container,{class:"pan"}),t.appendChild(this.pan_container),setTimeout(function(){this.addPan(),this.container.appendChild(this.pan_interactive_container),this.finish_props.pan=!0,this.finish()}.bind(this),this.deley),setTimeout(function(){this.addTooltip(),this.finish_props.tooltip=!0,this.finish()}.bind(this),this.deley),setTimeout(function(){this.addLegend(),this.finish_props.legend=!0,this.finish()}.bind(this),this.deley),this.container.appendChild(t)}this.chart=t,this.endTime("Chart.draw",1)},Chart.prototype.addTooltip=function(){this.startTime("Chart.addTooltip");let t=this.getDomHelper().createElement("div",this.makeClassName("chart-tooltip")),e=this.getDomHelper().createElement("div","tooltip-title");t.appendChild(e);let i=this.getDomHelper().createElement("div","tooltip-body"),s={},n={};for(let t in this.y_data){let e=this.getDomHelper().createElement("div","col-"+t);this.getDomHelper().setAttributes(e,{style:"color: "+(this.data.colors[t]||this.line_color)});let h=this.getDomHelper().createElement("div","val");e.appendChild(h);let r=this.getDomHelper().createElement("div","name");r.textContent=this.data.names[t]||t,e.appendChild(r),i.appendChild(e),n[t]=h,s[t]=e}t.appendChild(i),this.tooltip={tooltip:t,title:e,cols:s,values:n},this.container.appendChild(t),this.endTime("Chart.addTooltip",1)},Chart.prototype.getPanWidth=function(){return this.getAxisWidth()},Chart.prototype.getPanHeight=function(){let t=this.getAxisBottom()+this.pan_top_space;this.pan_height},Chart.prototype.addPan=function(){this.startTime("Chart.addPan");let t=this.getAxisBottom()+this.pan_top_space,e=t+this.pan_height,i=this.getAxisLeft(),s=this.getAxisRight()-i,n=e-t,h=this.ChartMath.getYRatio(s,n,this.y_min_real,this.y_max_real,this.formatYValue.bind(this)),r=this.ChartMath.getXRatio(s,n,this.x_data.length,this.pan_x_space),a=this.getDomHelper().createElementNS(this.svgns,"g","pan-lines"),o={};if(r.axis_x_num>=this.x_data.length)return!0;for(let t=0,s=0;t<r.axis_x_num;t++,s+=r.axis_x_step){let n=t+1===r.axis_x_num,a=parseInt(i+parseInt(s)*r.x_ratio);for(let l in this.y_data){if(this.y_inactive[l]||"line"!==this.data.types[l])continue;let d=parseInt(e-parseInt(this.y_data[l][s])*h.y_ratio),p="";if(0===t?(p="M",o[l]=[]):1===t&&(p+=" Q "),p+=a+" "+d,o[l].push(p),n){let t=(o[l].length-1)%2;if(t)for(let e=0;e<2-t;e++)o[l].push(o[l][o[l].length-1]);s<this.y_data[l].length-1&&(o[l].push("L"+a+" "+d),o[l].push(i+parseInt(this.y_data[l].length-1)*r.x_ratio+" "+(e-parseInt(this.y_data[l][this.y_data[l].length-1])*h.y_ratio)))}}}this.pan_lines={};for(let t in o){let e=this.data.colors[t]||this.line_color;this.drawPanLine(a,t,o[t].join(" "),e)}this.pan_container.appendChild(a);let l=this.getDomHelper().createElement("div","pan-root");this.getDomHelper().setStyles(this.pan_interactive_container,{left:i+"px",top:t+"px",width:s+"px",height:n+"px"});let d=this.getDomHelper().createElement("div","fg");this.getDomHelper().setStyles(d,{height:n-2+"px"});let p=this.ChartMath.getInitFGWidth(s,r.axis_x_step),c=s-p,_=s-p,m=this.getDomHelper().createElement("div","resize-left");d.appendChild(m);let u=this.getDomHelper().createElement("div","resize-right");d.appendChild(u),this.getDomHelper().setStyles(d,{width:p+"px"});let g=this.getDomHelper().createElement("div","fg-left"),f=this.getDomHelper().createElement("div","fg-right");this.getDomHelper().setStyles(g,{width:s-p+"px"}),l.appendChild(g),l.appendChild(d),l.appendChild(f),this.pan_interactive_container.appendChild(l);let x={width:p,min_width:20,left:c,max:_,min:0,x_start:c,x_curr:c},y={width:s-p,left:0,width_curr:s-p},C={width:0,right:0,width_curr:0},v=function(t){t.preventDefault(),t.stopPropagation(),this.lock_event=!0;let e=t.pageX-x.x_start,i=x.left+e;i<x.min?(x.x_curr=x.min,y.width_curr=x.min,C.width_curr=s-x.width):i>x.max?(x.x_curr=x.max,y.width_curr=x.max,C.width_curr=0):(x.x_curr=i,y.width_curr=i,C.width_curr=s-i-x.width),this.getDomHelper().setStyles(d,{right:"auto",left:x.x_curr+"px"}),this.getDomHelper().setStyles(g,{right:"auto",width:y.width_curr+"px"}),this.getDomHelper().setStyles(f,{left:"auto",width:C.width_curr+"px"})}.bind(this),D=function(t){if(t.target!==d)return!1;x.x_start=t.pageX,document.body.addEventListener("mousemove",v),document.body.addEventListener("mouseup",w)}.bind(this);d.addEventListener("mousedown",D);let w=function(t){this.lock_event=!1,x.left=x.x_curr,y.width=y.width_curr,C.width=C.width_curr,document.body.removeEventListener("mousemove",v),document.body.removeEventListener("mouseup",w),E()}.bind(this),H=!1,b=function(t){let e,i,n,h;t.preventDefault(),t.stopPropagation(),this.lock_event=!0,n=t.pageX-x.x_start,H?(e=0,i=x.left+x.width-x.min_width,h=x.left+n):(e=x.left+x.min_width,i=s,h=x.left+x.width+n),h<e?H?(x.width_curr=s-C.width_curr,x.x_curr=e,y.width_curr=x.min,C.width_curr=s-x.width_curr):(x.width_curr=x.min_width,C.width_curr=s-x.width_curr-x.left):h>i?H&&y.width_curr+x.width_curr<=s?(x.x_curr=i,x.width_curr=x.min_width,y.width_curr=i,C.width_curr=s-x.width_curr-y.width_curr):H||(x.width_curr=s-x.left,C.width_curr=0):H?(x.x_curr=h,x.width_curr=x.left+x.width-h,y.width_curr=y.width+n,C.width_curr=s-h-x.width_curr):(x.width_curr=h-x.left,C.width_curr=s-h),this.getDomHelper().setStyles(g,{right:"auto",width:y.width_curr+"px"}),this.getDomHelper().setStyles(f,{left:"auto",width:C.width_curr+"px"}),this.getDomHelper().setStyles(d,{right:"auto",left:x.x_curr+"px",width:x.width_curr+"px"})}.bind(this),A=function(t){if(t.target===m)H=!0;else{if(t.target!==u)return!1;H=!1}x.x_start=t.pageX,document.body.addEventListener("mousemove",b),document.body.addEventListener("mouseup",M)}.bind(this);m.addEventListener("mousedown",A),u.addEventListener("mousedown",A);let M=function(t){this.lock_event=!1,x.width=x.width_curr,x.left=x.x_curr,x.max=s-x.width,y.width=y.width_curr,C.width=C.width_curr,document.body.removeEventListener("mousemove",b),document.body.removeEventListener("mouseup",M),E()}.bind(this);this.endTime("Chart.addPan",1);let E=function(){this.pan_fg_width=x.width,this.pan_fg_left=x.left,setTimeout(this.reDraw.bind(this),this.deley)}.bind(this)},Chart.prototype.addLegend=function(){this.startTime("Chart.addLegend");let t=this.getAxisLeft(),e=this.getAxisBottom()+this.pan_height+this.pan_top_space+20,i=this.getDomHelper().createElement("div",this.makeClassName("legend"));this.getDomHelper().setStyles(i,{top:e+"px",left:t+"px"});for(let t in this.y_data){let e=this.getDomHelper().createElement("div","legend-item");this.getDomHelper().addClass(e,this.makeClassName("legend-item-"+t));let s=this.data.colors[t]||this.line_color,n=this.getDomHelper().createElement("div","circle");this.getDomHelper().setStyles(n,{"border-color":s,background:s}),e.appendChild(n);let h=this.getDomHelper().createElement("div","title");h.textContent=this.data.names[t],e.appendChild(h);let r=function(e){this.getDomHelper().classExists(n,"inactive")?this.y_inactive[t]=!1:this.y_inactive[t]=!0,this.getDomHelper().toggleClass(n,"inactive"),this.getDomHelper().setStyles(n,{background:s}),this.lines[t]&&(this.y_inactive[t]?(this.getDomHelper().setStyles(n,{background:"transparent"}),this.getDomHelper().addClass(this.lines[t],"inactive"),this.getDomHelper().addClass(this.pan_lines[t],"inactive"),this.getDomHelper().addClass(this.tooltip.cols[t],"inactive")):(this.getDomHelper().removeClass(this.lines[t],"inactive"),this.getDomHelper().removeClass(this.pan_lines[t],"inactive"),this.getDomHelper().removeClass(this.tooltip.cols[t],"inactive"))),setTimeout(this.reDraw.bind(this),this.deley)};e.addEventListener("click",r.bind(this)),i.appendChild(e),0}this.container.appendChild(i),this.endTime("Chart.addLegend",1)},Chart.prototype.addHVLine=function(t,e,i,s,n,h,r,a,o){let l=this.getDomHelper().createElementNS(this.svgns,"line");this.getDomHelper().setAttributes(l,{x1:i,x2:n,y1:s,y2:h,stroke:"#bbbbbb"});let d=this.getDomHelper().createElementNS(this.svgns,"text");this.getDomHelper().setAttributes(d,{x:r,y:a,"text-anchor":"x"===e?"middle":"inherit",fill:"#bbbbbb"}),this.getDomHelper().addClass(d,this.makeClassName("title")),this.getDomHelper().addClass(d,this.makeClassName(e));let p=this.getDomHelper().createTextNode(o);return d.appendChild(p),this.getDomHelper().addClass(l,this.makeClassName(e)),t.appendChild(l),t.appendChild(d),l},Chart.prototype.getAxisLeft=function(){return this.axis_padding[3]},Chart.prototype.getAxisRight=function(){return this.container_width-this.axis_padding[1]},Chart.prototype.getAxisTop=function(){return this.axis_padding[0]},Chart.prototype.getAxisBottom=function(){return this.container_height-this.axis_padding[2]},Chart.prototype.getAxisWidth=function(){return this.getAxisRight()-this.getAxisLeft()},Chart.prototype.getAxisHeight=function(){return this.getAxisBottom()-this.getAxisTop()},Chart.prototype.addChartLines=function(t,e){this.startTime("Chart.addChartLines");let i=this.ChartMath.getYRatio(this.getAxisWidth(),this.getAxisHeight(),this.y_min,this.y_max,this.formatYValue.bind(this)),s=this.ChartMath.getXRatio(this.getAxisWidth(),this.getAxisHeight(),this.x_data_sliced.length),n=this.getAxisBottom()-i.y_ratio*Math.abs(i.y_axis_min_v);for(let h in this.y_data_sliced){if(this.y_inactive[h])continue;let r=this.data.colors[h]||this.line_color;if("line"===this.data.types[h]){let a=this.y_data_sliced[h],o="",l=[];for(let t in a){let h=this.getAxisLeft()+parseInt(t)*s.x_ratio,d=n-parseInt(a[t])*i.y_ratio;o+=h+","+d+" ",e&&l.push({x1:h,y1:d,color:r,p:t})}setTimeout(function(){this.startTime("Chart.addChartLines.addCircles");for(let t in l){let i=this.makeCircle(l[t].x1,l[t].y1,l[t].color,l[t].p);e.appendChild(i)}this.endTime("Chart.addChartLines.addCircles",1)}.bind(this),this.deley),void 0===this.lines[h]?this.drawChartLine(t,h,o,r):this.getDomHelper().setAttributes(this.lines[h],{points:o})}}setTimeout(function(){this.finish_props.lines=!0,this.finish()}.bind(this),this.deley),this.endTime("Chart.addChartLines",1)},Chart.prototype.drawChartLine=function(t,e,i,s){let n=this.getDomHelper().createElementNS(this.svgns,"polyline","line");this.getDomHelper().setAttributes(n,{points:i,fill:"none",stroke:s}),this.getDomHelper().addClass(n,"line-"+e),this.lines[e]=n,t.appendChild(n)},Chart.prototype.drawPanLine=function(t,e,i,s){let n=this.getDomHelper().createElementNS(this.svgns,"path","line");this.getDomHelper().setAttributes(n,{d:i,fill:"none",stroke:s}),this.getDomHelper().addClass(n,"line-"+e),this.pan_lines[e]=n,t.appendChild(n)},Chart.prototype.makeCircle=function(t,e,i,s){let n=this.getDomHelper().createElementNS(this.svgns,"circle","point");return this.getDomHelper().setAttributes(n,{cx:t,cy:e,r:4,stroke:i,"stroke-width":2}),this.getDomHelper().addClass(n,"point-"+s),n},Chart.prototype.reDraw=function(){this.getDomHelper();let t=this.y_max,e=this.x1_range,i=this.x2_range;if(this.findMaxMin(),t===this.y_max&&e===this.x1_range&&i===this.x2_range&&getObjLength(this.lines)===getObjLength(this.y_data))return!0;let s=function(){for(;this.circles_container.firstChild;)this.circles_container.removeChild(this.circles_container.firstChild);this.addChartLines(this.lines_container,this.circles_container)}.bind(this);(function(){for(;this.axis_container.firstChild;)this.axis_container.removeChild(this.axis_container.firstChild);this.addXAxis(this.axis_container),this.addYAxis(this.axis_container)}).bind(this)(),s()},Chart.prototype.addXAxis=function(t){this.startTime("Chart.addXAxis");let e=this.ChartMath.getXRatio(this.getAxisWidth(),this.getAxisHeight(),this.x_data_sliced.length),i=this.getAxisLeft(),s=this.getAxisTop(),n=this.getAxisBottom(),h=this.x_data_sliced;for(let r=0,a=0;r<e.axis_x_num;r++,a+=e.axis_x_step){let r=this.formatTitle("x",h[a]),o=i+a*e.x_ratio;this.addHVLine(t,"x",o,s,o,n,o,n+15,r)}this.endTime("Chart.addXAxis",1)},Chart.prototype.addYAxis=function(t){this.startTime("Chart.addYAxis");let e=this.ChartMath.getYRatio(this.getAxisWidth(),this.getAxisHeight(),this.y_min,this.y_max,this.formatYValue.bind(this)),i=this.getAxisLeft(),s=this.getAxisRight(),n=this.getAxisBottom();for(let h=0,r=e.y_axis_min_v;h<=e.axis_y_num;h++,r+=e.axis_y_step){let h=this.formatYValue(r),a=n;this.addHVLine(t,"y",i,a,s,a,i+0,a+-5,this.formatTitle("y",h));n-=e.axis_y_space}this.endTime("Chart.addYAxis",1)},Chart.prototype.makeAxisInteractiveRect=function(t){this.startTime("Chart.makeAxisInteractiveRect");let e=this.getAxisLeft(),i=this.getAxisRight(),s=this.getAxisTop(),n=this.getAxisBottom(),h=i-e,r=n-s,a=this.getDomHelper().createElement("div","rect-interactive"),o=this.inter_line,l=this.ChartMath.getYRatio(this.getAxisWidth(),this.getAxisHeight(),this.y_min,this.y_max,this.formatYValue.bind(this));this.getDomHelper().setStyles(a,{left:e+"px",top:s+"px",width:h+"px",height:r+"px"});a.addEventListener("mousemove",function(t){if(this.lock_event)return!1;let e=t.offsetX/h,i=Math.floor(e*this.x_data_sliced.length);if(i<0||i>=this.x_data_sliced.length)return!1;this.getDomHelper().addClass(o,"hover");let s=this.getDomHelper().findAll(this.config.container+" circle.hover");for(let t=0;t<s.length;t++)this.getDomHelper().removeClass(s[t],"hover");(s=this.getDomHelper().findAll(this.config.container+" circle.point-"+i)).length&&this.getDomHelper().setAttributes(o,{x1:s[0].getAttribute("cx"),y1:n-l.axis_y_last_pos,x2:s[0].getAttribute("cx"),y2:n});for(let t=0;t<s.length;t++)this.getDomHelper().addClass(s[t],"hover");let r=this.x_data_sliced;this.tooltip.title.textContent=this.formatTooltipTitle(r[i]),this.getDomHelper().setAttributes(this.tooltip.tooltip,{style:"left: "+t.screenX+"px; top: "+t.screenY+"px;"});for(let t in this.y_data)this.tooltip.values[t].textContent=this.y_data[t][i];this.getDomHelper().addClass(this.tooltip.tooltip,"hover")}.bind(this)),a.addEventListener("mouseout",function(t){this.getDomHelper().removeClass(this.tooltip.tooltip,"hover"),this.getDomHelper().removeClass(o,"hover");let e=this.getDomHelper().findAll(this.config.container+" circle.hover");for(let t=0;t<e.length;t++)this.getDomHelper().removeClass(e[t],"hover")}.bind(this)),this.getDomHelper().addClass(o,this.makeClassName("interactive-line")),this.container.appendChild(a),this.endTime("Chart.makeAxisInteractiveRect",1)},Chart.prototype.startTime=function(t){this.performance[t]={start:+new Date,end:null}},Chart.prototype.endTime=function(t,e){this.performance[t].end=+new Date,e&&this.debug_mode&&console.log("'"+t+"' took "+(this.performance[t].end-this.performance[t].start).toFixed(1)+" ms")};