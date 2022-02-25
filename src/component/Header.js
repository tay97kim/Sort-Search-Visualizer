import React from "react";

import Slider from '@material-ui/core/Slider';

import { Button, Button2, Container, Wrapper, ControlWrapper, SpeedWrapper, SpeedContainer, SortWrapper, SearchWrapper, SpanWrapper, CheckBox, CountContainer} from "./header.style";
import { Typography } from "@material-ui/core";

var valueBtn = false;
var valueSpeed = 3;
var valueCP = 0;
var valueSW = 0;
var valueMC = 0;
var valueSC = 0;
var taskType = 0;
var sorted = 0;
var historyIdx = 1;

export function valueClear() { //새 작업 진행 시 비교/교환/병합/탐색 횟수들을 모두 초기화
    valueCP = 0;
    valueSW = 0;
    valueMC = 0;
    valueSC = 0;
}

export function plusValue(int) { //작업 진행에 따른 비교/교환/병합/탐색 횟수 값 증가
    switch (int) {
        case 1: 
            valueCP++; //비교 횟수(Comparison)
            break;
        case 2: 
            valueSW++; //교환 횟수(Swap)
            break;
        case 3: 
            valueMC++; // 병합 횟수(Merge)
            break;
        case 4: 
            valueSC++; // 탐색 횟수(Search)
            break;
        default: 
    }
}

export const historyUpdate = async (mode, idx, value1, value2) =>{ //탐색이 진행되는 동안의 기록을 text로 추가
    var history;
    history = document.getElementById("history");

    switch(mode){
        case 1:{
            history.textContent = history.textContent+historyIdx+"회차 탐색값: "+idx+" ";
            break;
        }
        case 2:{
            history.textContent = history.textContent + historyIdx+"회차 중간값: "+idx+" 탐색범위: "+value1+"~"+value2+" ";
            break;
        }
    }
    historyIdx++;
}

export function getSpeed() { //작업속도 반환
    return valueSpeed;
}

export function buttonOn() { //작업 종료 시 버튼 활성화
    valueBtn = false;
}

export default function Header({ sortPause, setArray, updateList, rangeChange, selectClicked, bubbleClicked, insertClicked, mergeClicked, sequentialSearch, binarySearch, sortStart }) {
    
    const [valueS, setValueS] = React.useState(3);

    const sleep = (milliseconds) => { //딜레이 메소드
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };

    const SliderChange = (event, newValue) => { //슬라이더의 속도값을 바꿀 때 마다 실행되는 함수
        setValueS(newValue);
        setSpeed(valueS);
        document.getElementById("speedV").innerText = newValue;
    };

    function setSpeed(inputSpeed) { //valueSpeed를 갱신
        valueSpeed = inputSpeed;
    }

    function buttonOff() { //정렬 시작 버튼 클릭 시 실행
        if (valueBtn === false) {
            if (taskType === 0) {
                alert("정렬의 종류를 먼저 선택한 뒤 시작해주세요");
            }
            else {
                valueBtn = true;
                onTask();
                sortStart();
                sorted=1;
            }
        }
    }

    function setArrayBtn() { //직접 배열 생성 버튼 클릭 시 실행
        if (valueBtn === false) {
            sorted = 0;
            valueClear();
            setArray();
        }
    }

    function updateListBtn() { //새 배열 생성 버튼 클릭 시 실행
        if (valueBtn === false) {
            sorted = 0;
            valueClear();
            updateList();
        }
    }

    function rangeChangeBtn() { //원소개수설정 버튼 클릭 시 실행
        if (valueBtn === false) {
            sorted = 0;
            valueClear();
            rangeChange();
        }
    }

    function select() { //선택정렬 버튼 클릭 시 실행
        if (valueBtn === false) {
            taskType = 1;
            selectClicked(); //App.js 함수
        }
    }

    function bubble() { //버블정렬 버튼 클릭 시 실행
        if (valueBtn === false) {
            taskType = 2;
            bubbleClicked();
        }
    }

    function insert() { //삽입정렬 버튼 클릭 시 실행
        if (valueBtn === false) {
            taskType = 3;
            insertClicked();
        }
    }

    function merge() { //병합정렬 버튼 클릭 시 실행
        if (valueBtn === false) {
            taskType = 4;
            mergeClicked();
        }
    }

    function sequential(){ //순차탐색 버튼 클릭 시 실행
        historyClear();
        valueBtn = true;
        taskType = 5;
        onTask();
        showHistory();
        sequentialSearch();
    }

    function historyClear(){ //탐색 작업 시 탐색기록을 초기화
        var history;
        history = document.getElementById("history");
        history.innerHTML = "";
        historyIdx = 1;
    }

    function binary(){ //이진탐색 버튼 클릭 시 실행
        if(sorted == 0){
            alert("정렬된 배열에서 탐색을 진행할 수 있도록 원소 변경 후, 최소 한 번의 정렬을 진행해주세요.");
        }
        else{
            historyClear();
            valueBtn = true;
            taskType = 6;
            onTask();
            showHistory();
            binarySearch();
        }
    }

    function showHistory(){
        if(!document.getElementById("searchHistory").checked)
            document.getElementById("searchHistory").checked = true;
    }
    
    function pause() { //일시정지 버튼 클릭 시 실행
        if (valueBtn === true) {
            sortPause();
        }
    }

    const onTask = async () => { //현재 진행중인 작업은 검정색으로 표시
        var top = document.getElementById("top");
        var control = document.getElementById("control");
        var task;

        switch (taskType) {
            case 1: {
                task = document.getElementById("select");
                break;
            }
            case 2: {
                task = document.getElementById("bubble");
                break;
            }
            case 3: {
                task = document.getElementById("insert");
                break;
            }
            case 4: {
                task = document.getElementById("merge");
                break;
            }
            case 5: {
                task = document.getElementById("sequential");
                break;
            }
            case 6: {
                task = document.getElementById("binary");
                break;
            }
        }
        task.style.color = "black";
        top.style.backgroundColor = "lightgray";
        control.style.backgroundColor = "gray";
        while (valueBtn) {//on Sorting
            await sleep(100);
        }
        task.style.color = "white";
        task.addEventListener('mouseover', function() {
            this.style.color = "green";
        });
        
        task.addEventListener('mouseout', function() {
            this.style.color = "white";
        });
        top.style.backgroundColor = "#77E000";
        control.style.backgroundColor = "#1CD90B";
    }

    return (
        <Container>
            < Wrapper id="top" >
                <Button onClick={setArrayBtn}>직접배열생성</Button>
                <Button onClick={updateListBtn}>새 배열생성</Button>
                <Button onClick={rangeChangeBtn}>원소개수설정</Button>

                <SpeedContainer>
                    <SpeedWrapper>
                        <Typography id="speedV" gutterBottom>
                            3
                        </Typography>
                        <Slider
                            value={valueS}
                            onChange={SliderChange}
                            min={1}
                            max={5}
                        />
                    </SpeedWrapper>
                    <p >속도설정</p>
                </SpeedContainer>

                <SortWrapper>
                    <Button2 id="select" onClick={select}>선택정렬</Button2>
                    <Button2 id="bubble" onClick={bubble}>버블정렬</Button2>
                    <Button2 id="insert" onClick={insert}>삽입정렬</Button2>
                    <Button2 id="merge" onClick={merge}>병합정렬</Button2>
                </SortWrapper>
                <SearchWrapper>
                    <Button2 id="sequential" onClick={sequential}>순차탐색</Button2>
                    <Button2 id="binary" onClick={binary}>이진탐색</Button2>
                </SearchWrapper>
            </ Wrapper >
            <ControlWrapper id="control">
                <Button onClick={buttonOff}>정렬 시작</Button>
                <Button onClick={pause}>일시정지</Button>
                <CountContainer>
                    비교횟수:
                    <Typography>{valueCP}</Typography>
                </CountContainer>
                <CountContainer>
                    교환횟수:
                    <Typography>{valueSW}</Typography>
                </CountContainer>
                <CountContainer>
                    병합횟수:
                    <Typography>{valueMC}</Typography>
                </CountContainer>
                <CountContainer>
                    탐색횟수:
                    <Typography>{valueSC}</Typography>
                </CountContainer>
                <SpanWrapper>
                    <span class="hidden">탐색결과<p/>표시</span>
                </SpanWrapper>
                <CheckBox>
                    <input type="checkbox" id="searchHistory"></input>
                    <label for="test"></label>
                    <div class="sidebar" id="history"></div>
                </CheckBox>
            </ControlWrapper>
        </Container>
    );
}
