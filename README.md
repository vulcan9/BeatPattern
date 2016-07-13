# BeatPattern
스크린 터치 (또는 마우스) 에 반응하여 두드리는 시간 간격(리듬 패턴)의 유사성을 검사하는 라이브러리

	* 이름 : JavaScript-BeatPattern
	* Version : 1.0.5 (2016.07.12)
	* (c) Dong-il Park(vulcanProject : http://vulcan9.tistory.com)
	*
	* Dependancy :
	* 		- None
	*
	* 용도 : 스크린 터치 (또는 마우스) 에 반응하여 두드리는 시간 간격(리듬 패턴)의 유사성을 검사하는 라이브러리
	*        - 사용자 인증하는 방법으로 사용할 수 있다.
	*        - 개인적으로는 프로그램 Easter Egg 런칭하는 방법으로 사용하고 있다.
	*
	* 브라우져 지원 여부 : all browsers, except IE before version 10
	*
	* 사용방법 : 별도 문서 (test.html) 참고

# API 목록

#### constant
	* MIN_SHORT = 10 : Number - 짧게 누름 시간 간격 구간 (10~220 milisecond)
	* MAX_SHORT = 220 : Number - 짧게 누름 시간 간격 구간 (10~220 milisecond)
	* MIN_LONG = 220 : Number - 보통 누름 시간 간격 구간 (220 ~ 900 milisecond)
	* MAX_LONG = 900 : Number - 보통 누름 시간 간격 구간 (220 ~ 900 milisecond)
	* MIN_VARY_LONG = 900 : Number - 길게 누름 시간 간격 구간 (900 ~ 2500 milisecond)
	* MAX_VARY_LONG = 2500 : Number - 길게 누름 시간 간격 구간 (900 ~ 2500 milisecond)
	* MAX_INTERVAL = 2500 : Number - 누름 간격 보류 시간 허용치 (시간안에 다음 터치(누름)가 인식되어야 함)
	* RETRY_INTERVAL = 100 : Number - 패턴 실패시 다음 검사 가능 시점까지 시간 간격

#### properties
	*

#### Function
	* createPattern : function(target) - 누름을 인식할 target을 설정함
	* setPattern : function(patternData, onSuccess, onFail) - 패턴 데이터를 입력하고 핸들러를 등록함
	* hasPattern : function(dataObj) - 패턴이 이미 등록되어 있는지 검사
	* resetPattern : function() - 기존 패턴과 이벤트로 다시 검사 초기화
	* destroy : function(anchorID) - 모두 초기화

# 샘플 코드

```
        var pattern = new BeatPattern();

        // 이벤트 세팅
        pattern.createPattern(document.body);

        // 패턴 세팅
        var patternData = [0, 0, 0, 1, 1, 1];
        pattern.setPattern(patternData, onSuccess, onFail);

        function onSuccess(){}
        function onFail(){}

        // 기존 패턴과 이벤트로 다시 검사 초기화
        pattern.resetPattern();
```
패턴 데이터를 정의할때는 0,1,2 값으로 표기할 수 있다
 - 0 : 짧게 누르고 있는 상태
 - 1 : 중간 누르고 있는 상태
 - 2 : 길게 누르고 있는 상태

각 값들은 누르는 행동 사이 시간 간격이 아니라 누르고 있는 상태의 시간 간격을 의미한다.
따라서 위 샘플에서 사용한 패턴은 짧게 3번 누른 후 중간 길이로 각 3번 눌렀을때 패턴일치 결과를 리턴한다.

# History

##### Version : 1.0.0 (2014년 어느때...)
		- Actionscript 코드로 첫 배포
##### Version : 1.0.3 (2015년 어느때...)
		- javascript 코드로 포팅
##### Version : 1.0.5 (2016.07.12)
		- Jquery 라이브러리 의존성 없앰
		- Github 배포