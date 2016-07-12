/**
 * Created by dongil on 2016-07-12.
 * BeatPattern 1.0.5
 * https://github.com/vulcan9/BeatPattern
 */


/**
 var pattern = new BeatPattern();

 // 이벤트 세팅
 pattern.createPattern(this);

 // 패턴 세팅
 var patternData = [0, 0, 0, 1, 1, 1];
 pattern.setPattern(patternData, onSuccess, onFail);

 function onSuccess(){}
 function onFail(){}

 // 기존 패턴과 이벤트로 다시 검사 초기화
 pattern.resetPattern();
*/

var out = function(){
    //console.log.apply(console, arguments);
};

function BeatPattern(){}

BeatPattern.prototype = {
    _currentPattern: undefined,

    _onSuccess: undefined,
    _onFail: undefined,

    setPattern: function(patternArray, onSuccess, onFail){
        this._currentPattern = patternArray;
        this._onSuccess = onSuccess;
        this._onFail = onFail;

        if(this.hasPattern){
            out("패턴검사 가능");
        }else{
            out("패턴이 정의되지 않았습니다.");
        }
    },

    hasPattern: function (){
        return (this._currentPattern && this._currentPattern.length > 1);
    },

    resetPattern: function (target, patternArray){
        target = target || this.target;
        patternArray = patternArray || this._currentPattern;

        this.clear();
        this.deletePattern();

        this.createPattern(target);
        this.setPattern(patternArray);
    },

    destroy: function(){
        this.clear();
        if(this.deletePattern) this.deletePattern();
        this._currentPattern = null;
        this._onSuccess = null;
        this._onFail = null;
    },

    ////////////////////////////////////////////////////////////////
    //
    // Pattern 인식 이벤트 객체
    //
    ////////////////////////////////////////////////////////////////

    // 마우스 이벤트를 받을 객체
    target: undefined,

    // 마우스 누름 시간 간격을 인식하여 올바른 패턴과 비교한다
    deletePattern: undefined,

    createPattern: function (target){
        if(!target) return;
        var self = this;

        this.deletePattern = function (){
            if(!self.target) return;
            //$(target).off('mousedown', onMouseDown);
            //$(target).off('mouseup', onMouseUp);
            self._off(target, 'mousedown', onMouseDown);
            self._off(target, 'mouseup', onMouseUp);
            self.target = null;
        };

        //$(target).on('mousedown', onMouseDown);
        //$(target).on('mouseup', onMouseUp);
        this._on(target, 'mousedown', onMouseDown);
        this._on(target, 'mouseup', onMouseUp);
        this.target = target;

        function onMouseDown(){
            // 시간 간격 체크
            self.startGesture();
        }
        function onMouseUp(){
            // 시간 간격 체크
            self.endGesture();
        }
    },

    _on: function(target, eventType, handler){
        if (target.addEventListener){
            // 웹 표준 브라우저용 이벤트 등록
            target.addEventListener(eventType, handler, false);
        } else if (target.attachEvent) {
            // IE용 이벤트 등록
            target.attachEvent('on' + eventType, handler);
        } else if (target['on' + eventType]) {
            // DOM 레벨 0
            target['on' + eventType] = handler;
        }
    },
    _off: function(target, eventType, listener){
        if (target.removeEventListener){
            // 웹 표준 브라우저용 이벤트 제거
            target.removeEventListener(eventType, listener);
        }else if (target.detachEvent) {
            // IE용 이벤트 제거
            target.detachEvent('on' + eventType, listener);
        } else if (target['on' + eventType]) {
            // DOM 레벨 0
            target['on' + eventType] = null;
        }
    },

    /////////////////////////////////
    // 체크
    /////////////////////////////////

    // 짧게 누름 시간 간격 구간 (10~220, 220이하)
    MIN_SHORT: 10,
    MAX_SHORT: 220,

    // 보통 누름 시간 간격 구간 (220 ~ 900 이하)
    MIN_LONG: 220,
    MAX_LONG: 900,

    // 길게 누름 시간 간격 구간 (900 ~ 2500 이하)
    MIN_VARY_LONG: 900,
    MAX_VARY_LONG: 2500,

    // pattern 간격 보류 시간 허용치
    // INTERVAL 시간안에 다음 패턴이 검사되어야 한다
    //MAX_INTERVAL: 900,
    MAX_INTERVAL: 2500,

    // 패턴 실패시 다음 검사 가능 시점까지 인터벌
    RETRY_INTERVAL: 100,

    //-------------------------------
    // 시간 체크
    //-------------------------------

    _sTime: 0,
    _eTime: 0,

    getTimer: function(){
        return (new Date()).getTime();
    },

    startGesture: function (){
        this.clearNextInterval();
        this._sTime = this.getTimer();
    },

    endGesture: function (){
        this._eTime = this.getTimer();
        this.checkProgress();
    },

    // gesture 지속 시간 (마우스 누르고 있는 시간)
    getGestureDuration: function (){
        //duration
        return this._eTime - this._sTime;
    },

    //-------------------------------
    // 패턴 체크
    //-------------------------------

    _gestureIndex: -1,

    checkProgress: function (){
        if(!this.hasPattern){
            out("패턴이 정의되지 않았습니다.");
            return;
        }

        if(this._gestureIndex < 0){
            //******************************
            // 패턴 초기화

            //this.setPattern(_patterns[0]);

            //******************************

            out("패턴 비교 시작");
        }

        ++this._gestureIndex;

        // 합격 시간 구간
        var signal = this._currentPattern[this._gestureIndex];
        var minimum;
        var maximum;
        switch(signal){
            case 0:
                minimum = this.MIN_SHORT;
                maximum = this.MAX_SHORT;
                break;
            case 1:
                minimum = this.MIN_LONG;
                maximum = this.MAX_LONG;
                break;
            case 2:
                minimum = this.MIN_VARY_LONG;
                maximum = this.MAX_VARY_LONG;
                break;
        }

        // 실제 걸린 시간
        var delay = this.getGestureDuration();
        out("delay : ", delay);

        if(minimum > delay || maximum < delay){
            // 실패
            this.patternFailed();
            return;
        }

        // 통과
        if(this._gestureIndex == this._currentPattern.length-1){
            // 모든 패턴을 통과했으므로 종료
            this.patternComplete();
            return;
        }

        // 다음 패턴 검사 대기
        this.nextPattern();
    },

    patternComplete: function (){
        this.clear();
        this.dispatchEvent("success");
        out("성공");
    },

    patternFailed: function (){
        // 초기화 및 일정 시간 후 재시도 가능하도록 시간 간격을 둠
        this.clear();
        this.dispatchEvent("fail");

        this.setRetryInterval();
        out("실패");
    },

    dispatchEvent: function(type){
        //dispatchEvent(new Event("success"));
        if(type == "success"){
            this._onSuccess();
        }else if(type == "fail"){
            this._onFail();
        }
    },

    ////////////////////////////////////////////////////////////////
    //
    // Pattern 인식
    //
    ////////////////////////////////////////////////////////////////

    clear: function (){
        this.clearNextInterval();
        this._gestureIndex = -1;
        this._sTime = this._eTime = -1;
    },

    nextPattern: function (){
        // 다음 패턴 검사까지 유효 시간을 체크
        this.setNextInterval();
    },

    _nextIntervalID: -1,
    setNextInterval: function (){
        var self = this;
        this.clearNextInterval();
        this._nextIntervalID = setInterval(timeOut, this.MAX_INTERVAL);

        function timeOut(){
            self.clearNextInterval();
            self.patternFailed();
        }
    },

    clearNextInterval: function (){
        if(this._nextIntervalID != -1) clearInterval(this._nextIntervalID);
        this._nextIntervalID = -1;
    },

    _retryIntervalID: -1,
    setRetryInterval: function (){
        var self = this;
        var target = this.target;
        this.clearRetryInterval();
        this._retryIntervalID = setInterval(timeOut, this.RETRY_INTERVAL);
        this.deletePattern();

        function timeOut(){
            self.clearRetryInterval();
            self.createPattern(target);
            out("재검사 대기");
        }
    },

    clearRetryInterval: function (){
        if(this._retryIntervalID) clearInterval(this._retryIntervalID);
        this._retryIntervalID = -1;
    }
};

////////////////////////////////////////
// Export
////////////////////////////////////////

module.exports = BeatPattern;