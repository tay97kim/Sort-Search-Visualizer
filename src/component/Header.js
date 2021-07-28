import React from "react";

import Slider from '@material-ui/core/Slider';

import { Button, Button2, Container, Wrapper, ControlWrapper, SpeedWrapper, SpeedContainer, SortWrapper, SearchWrapper, CountContainer} from "./header.style";
import { Typography } from "@material-ui/core";

var valueBtn = false;
var valueSpeed = 3;
var valueCP = 0;
var valueSW = 0;
var valueMC = 0;
var valueSC = 0;
var taskType = 0;
var sorted = 0;

export function valueClear() {
    valueCP = 0;
    valueSW = 0;
    valueMC = 0;
    valueSC = 0;
}

export function plusValue(int) {
    switch (int) {
        case 1: 
            valueCP++;
            break;
        case 2: 
            valueSW++;
            break;
        case 3: 
            valueMC++;
            break;
        case 4: 
            valueSC++;
            break;
        default: 
    }
}

export function getSpeed() {
    return valueSpeed;
}

export function buttonOn() {
    valueBtn = false;
}

export default function Header({ sortPause, setArray, updateList, rangeChange, selectClicked, bubbleClicked, insertClicked, mergeClicked, sequentialSearch, binarySearch, sortStart }) {
    
    const [valueS, setValueS] = React.useState(3);

    const sleep = (milliseconds) => { //딜레이 메소드
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };

    const SliderChange = (event, newValue) => {
        setValueS(newValue);
        setSpeed(valueS);
        document.getElementById("speedV").innerText = newValue;
    };

    function setSpeed(inputSpeed) {
        valueSpeed = inputSpeed;
    }

    function buttonOff() {
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

    function setArrayBtn() {
        if (valueBtn === false) {
            sorted = 0;
            valueClear();
            setArray();
        }
    }

    function updateListBtn() {
        if (valueBtn === false) {
            sorted = 0;
            valueClear();
            updateList();
        }
    }

    function rangeChangeBtn() {
        if (valueBtn === false) {
            sorted = 0;
            valueClear();
            rangeChange();
        }
    }

    function select() {
        if (valueBtn === false) {
            taskType = 1;
            selectClicked();
        }
    }

    function bubble() {
        if (valueBtn === false) {
            taskType = 2;
            bubbleClicked();
        }
    }

    function insert() {
        if (valueBtn === false) {
            taskType = 3;
            insertClicked();
        }
    }

    function merge() {
        if (valueBtn === false) {
            taskType = 4;
            mergeClicked();
        }
    }

    function sequential(){
        valueBtn = true;
        taskType = 5;
        onTask();
        sequentialSearch();
    }

    function binary(){
        if(sorted == 0){
            alert("정렬된 배열에서 탐색을 진행할 수 있도록 원소 변경 후, 최소 한 번의 정렬을 진행해주세요.");
        }
        else{
            valueBtn = true;
            taskType = 6;
            onTask();
            binarySearch();
        }
    }
    
    function pause() {
        if (valueBtn === true) {
            sortPause();
        }
    }

    const onTask = async () => {
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
            </ControlWrapper>
        </Container>
    );
}

