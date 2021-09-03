/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import Header, { buttonOn, getSpeed, valueClear, plusValue, historyUpdate } from "../component/Header";
import Main from './Main';
import Footer from './Footer';

import './App.style.css';

function App() {
  var indexLimit = 100;
  const [size, setSize] = useState(8);
  const [arr, setArr] = useState([]);
  const [sortType, setSort] = useState(0);
  var taskSpeed = 3;
  const [curIdx, setCurIdx] = useState(null);
  const [nexIdx, setNexIdx] = useState(null);
  var mergeHistory = [];
  var mergeTotalIdx = 0;
  var redBarHistory = [];
  var redBarTotalIdx = 0;
  var purpleBarHistory = [];
  var purpleBarTotalIdx = 0;
  var onTaskHistory = [];
  var onTaskTotalIdx = 0;
  var countHistory = [];
  var countTotalIdx = 0;
  var searchCountHistory = [];
  var searchCountIdx = 0;

  useEffect(() => {
    updateList();
  }, [size]);

  const sleep = (milliseconds) => { //딜레이 메소드 (함수에서 사용 시 const 함수명 = async () =>{} 형태로 사용)
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const updateList = () => { //새 배열 생성
    var newArray = [];

    while (newArray.length < size) {
      var r = Math.floor(Math.random() * indexLimit) + 1;
      if (newArray.indexOf(r) === -1) newArray.push(r);
    }
    setArr(newArray);
  }

  const setArray = async () => { // 배열 직접 입력
    var toBig = false;
    var input = prompt("배열의 원소를 스페이스로 구분하여 입력해주세요. (ex: 12 3 45 6 7 8)\n- 원소의 최댓값은 100입니다.\n- 중복된 원소값은 정상적으로 동작하지 않을 수 있습니다.");
    if (input == null) {
    } else {
      const newArr = input.split(' ').map(Number);
      setSize(newArr.length);
      updateList();
      await sleep(10);
      for (var i = 0; i < newArr.length; i++) {
        if (newArr[i] > 100) {
          alert("원소의 최댓값 100보다 더 큰 값을 입력하였습니다. 랜덤으로 배열을 생성합니다.");
          toBig = true;
          break;
        }
      }
      if (toBig === false)
        setArr(newArr);
    }
  }

  const rangeChange = () => { // 배열 크기 지정
    const range = prompt("배열의 크기를 입력해주세요 [ 최대 100 ]\n- 30 이상부터는 숫자가 표시되지 않습니다.");
    if (range == null) {
    } else if (range > 100) {
      alert("배열의 최대크기보다 더 높게 입력하였습니다.\n배열의 크기가 100로 설정됩니다.");
      setSize(100);
      updateList();
    }
    else {
      setSize(range);
      updateList();

    }
  };

  const setFinished = (value) => {//정렬이 끝난 원소를 회색으로 변경
    var tmp = document.getElementById(value);
    tmp.style.backgroundColor = "gray";
  }

  const setNowIdx = (value) => {//현재 정렬 내 표적 인덱스를 지칭하거나 구분을 위한 1색(보라)
    var tmp = document.getElementById(value);
    tmp.style.backgroundColor = "purple";
  }

  const setCompIdx = (value) => {//현재 정렬 내 최소값이거나 교환 대상 인덱스이거나 구분을 위한 2색(빨강)
    var tmp = document.getElementById(value);
    tmp.style.backgroundColor = "#B50002";
  }

  const setFreeIdx = (value) => {//특정 bar 색상만 초기화
    var tmp = document.getElementById(value);
    tmp.style.backgroundColor = "#33A5DE";
  }

  const barGrayClear = () => {//정렬이 진행중이지 않은 곳을 구분하기 위해 검정색으로 덮어쓰기 
    for (let i = 0; i < arr.length; i++) {
      var tmp = document.getElementById(arr[i]);
      tmp.style.backgroundColor = "lightgray";
    }
  }

  const barClear = () => {//모든 bar 색상을 초기화
    for (let i = 0; i < arr.length; i++) {
      var tmp = document.getElementById(arr[i]);
      tmp.style.backgroundColor = "#33A5DE";
    }

  }

  const selectClicked = () => { //작업에 대해 onTask 작업 시 참조할 sortType 변수 값 지정 (선택정렬)
    setSort(1);
    valueClear();
  }

  const bubbleClicked = () => { //버블정렬
    setSort(2);
    valueClear();
  }

  const insertClicked = () => { //삽입정렬
    setSort(3);
    valueClear();
  }

  const mergeClicked = () => { //병합정렬
    setSort(4);
    valueClear();
  }

  const selectSort = async () => { //선택정렬 코드
    const inputArr = arr;
    let len = inputArr.length;
    let least;

    for (let i = 0; i < len; i++) { //배열 전체를 순회
      least = i;

      if (i != 0) {
        setFinished(inputArr[i - 1]); //다음 반복 진행 시 이전 인덱스의 그래프 색 gray 지정
      }

      setCompIdx(inputArr[least]);
      await sleep(375 / taskSpeed);

      for (let j = i + 1; j < len; j++) { //한 사이클마다 최소값을 확인
        setNowIdx(inputArr[j]);
        if (inputArr[j] < inputArr[least]) { //최소값보다 더 작은 값이라면
          setFreeIdx(inputArr[least]); //빨간색인 이전의 least번째 막대 그래프 색상 초기화
          setNowIdx(inputArr[j]); //j번째 막대 그래프 색상 변경(빨강)
          least = j; //최소값 또한 j로 변경
        }
        plusValue(1); 
        setArr([...arr]); //그래프를 최신 정보로 갱신
        setCompIdx(inputArr[least]); //현재 확인 중인 막대 그래프 색상 변경(보라)
        await sleep(375 / taskSpeed); //딜레이
        setFreeIdx(inputArr[j]); //j번째 막대 그래프 색상 초기화
      }
      if (i !== least) {//i번째 인덱스와 찾은 최소값을 swap
        setNowIdx(inputArr[i]);
        setCompIdx(inputArr[least]);
        await sleep(375 / taskSpeed);
        let tmp = inputArr[least];
        inputArr[least] = inputArr[i];
        inputArr[i] = tmp;
        setNowIdx(inputArr[i]);
        setCompIdx(inputArr[least]);
        plusValue(2);
        setArr([...arr]);
        await sleep(375 / taskSpeed);
      } else {
        await sleep(375 / taskSpeed);
        //do nothing
      }
      setFreeIdx(inputArr[least]);
      setFreeIdx(inputArr[i]);
    }
    barClear();
    buttonOn();
    alert("정렬이 완료되었습니다.");
  }

  const bubbleSort = async () => { //버블정렬 코드
    const inputArr = arr;
    let len = inputArr.length;
    var sorted = len;
    var swapped = false;
    for (let i = 0; i < len; i++) { //배열 전체 반복
      swapped = false;
      for (let j = 0; j < sorted - 1; j++) { //정렬이 진행될 때마다 끝에서부터 작업범위 감소
        plusValue(1);
        setArr([...arr]);
        setNowIdx(inputArr[j]);
        await sleep(375 / taskSpeed);
        if (inputArr[j] > inputArr[j + 1]) {//j번째 인덱스가 j+1번째보다 더 크다면 j+1번째와 swap
          setCompIdx(inputArr[j + 1]);
          await sleep(375 / taskSpeed);
          setArr([...arr]);
          let tmp = inputArr[j];
          inputArr[j] = inputArr[j + 1];
          inputArr[j + 1] = tmp;
          setCompIdx(inputArr[j + 1]);
          setNowIdx(inputArr[j]);
          plusValue(2);
          setArr(inputArr);
          swapped = true;
        } else {
          setArr(inputArr);
          await sleep(375 / taskSpeed);
        }
        await sleep(188 / taskSpeed);
        setFreeIdx(inputArr[j]);
      }
      if (sorted != 0)
        setFinished(inputArr[(sorted - 1)]);

      sorted--;
      setCurIdx(null);
      if (swapped === false) {
        while (sorted > 1) {
          plusValue(1);
          setArr([...arr]);
          setFinished(inputArr[(sorted - 1)]);
          sorted--;
          await sleep(750 / taskSpeed);
        }
        break;
      }
    }
    barClear();
    buttonOn();
    alert("정렬이 완료되었습니다.");
  }

  const insertionSort = async () => { //삽입정렬 코드
    setArr([...arr]);
    const inputArr = arr;
    let len = inputArr.length;
    let compIdx = 0;

    for (let i = 0; i < len; i++) { //배열 전체 반복
      setNowIdx(inputArr[i]);
      for (let j = i; j > 0; j--) { //i부터 0번째까지 반복하며 삽입할 원소를 적절한 위치까지 정렬
        plusValue(1);
        setArr([...arr]);
        await sleep(188 / taskSpeed);
        if (inputArr[j] < inputArr[j - 1]) {//j번째 인덱스가 더 j-1번째보다 작다면 j-1번째와 swap
          compIdx = j;
          setArr([...arr]);
          let tmp = inputArr[j];
          inputArr[j] = inputArr[j - 1];
          inputArr[j - 1] = tmp;
          plusValue(2);
          setFinished(inputArr[j]);
          setCompIdx(inputArr[j-1]);
          setArr([...arr]);
        } else {
          break;
        }
        await sleep(188 / taskSpeed);
      }
      await sleep(188 / taskSpeed);
      for (let k = 0; k < i + 1; k++) {
        setFinished(inputArr[k]);
      }
    }
    setNexIdx(null);
    barClear();
    buttonOn();
    alert("정렬이 완료되었습니다.");
  }

  const historyClear = () =>{ //작업 진행 전 관련 변수 초기화
    mergeHistory = [];
    mergeTotalIdx = 0;
    countHistory = [];
    countTotalIdx = 0;
    redBarHistory = [];
    redBarTotalIdx = 0;
    purpleBarHistory = [];
    purpleBarTotalIdx = 0;
    onTaskHistory = [];
    onTaskTotalIdx = 0;
    searchCountHistory = [];
    searchCountIdx = 0;
  }

  const mergeSort = (receivedArr) => { //병합정렬 코드 (병합정렬은 실시간으로 그래프 색상을 변경하지 않음)
    historyClear();
    mergeRecursion(receivedArr);
    mergeTimeLine();
  }

  const mergeRecursion = (receivedArr) => { //병합정렬 재귀 함수 (그 이유로는 재귀호출로 인한 제약사항이 존재함)
    setArr([...arr]); // 그 대신 작업 진행 간 그래프 색상 변경 내역을 배열들에 저장 후 정렬 종료 시 순차적으로 표현
    let recurArr = receivedArr;
    if (recurArr.length <= 1) {

      return recurArr;
    }

    const midIdx = Math.floor(recurArr.length / 2);
    let left = recurArr.slice(0, midIdx);
    let right = recurArr.slice(midIdx);

    addMergeHistory(arr);
    addCountHistory([false, false, false]);
    addRedBarHistory(left);
    addPurpleBarHistory([0]);
    addOnTaskHistory(recurArr);//왼쪽 표시

    addMergeHistory(arr);
    addCountHistory([false, false, false]);
    addRedBarHistory(left);
    addPurpleBarHistory(right);
    addOnTaskHistory(recurArr);//오른쪽 표시

    addMergeHistory(arr);
    addCountHistory([false, false, false]);
    addRedBarHistory([0]);
    addPurpleBarHistory([0]);
    addOnTaskHistory(recurArr);//색상 초기화

    let leftArr = mergeRecursion(left);
    let rightArr = mergeRecursion(right);

    let newArr = domerge(leftArr, rightArr);
    return newArr;
  }

  const domerge = (leftArr, rightArr) => {//대체 배열이 아닌 실제 배열의 인덱스를 서로 교환할 수 있게(반환x)
    setArr([...arr]);
    var left = leftArr.length;
    var right = rightArr.length;
    let least = 0;
    var compArr = [];
    compArr = leftArr.concat(rightArr);

    for (let i = 0; i < (left + right - 1); i++) {//두 배열의 크기만큼 반복하며 실제 배열을 정렬(최솟값 탐색)
      least = i;
      for (let j = (i + 1); j < (left + right); j++) {
        if (compArr[j] < compArr[least]) {
          least = j;
        }
      }
      if (least !== i) {//swap이 필요한 상태 > 함수에서 교환 증가
        addMergeHistory(arr);
        addCountHistory([true, false, false]);
        addRedBarHistory([compArr[least]]);
        addPurpleBarHistory([compArr[i]]);
        addOnTaskHistory(compArr);//교환 전 

        let tmp = compArr[i];
        compArr[i] = compArr[least];
        compArr[least] = tmp;

        swapInMerge(compArr[i], compArr[least]);

        addMergeHistory(arr);
        addCountHistory([false, true, false]);
        addRedBarHistory([compArr[i]]);
        addPurpleBarHistory([compArr[least]]);
        addOnTaskHistory(compArr);//교환 후
      } else {//이미 정렬이 된 상태
      }
      addMergeHistory(arr);
      addCountHistory([true, false, false]);
      addRedBarHistory([0]);
      addPurpleBarHistory([0]);
      addOnTaskHistory(compArr.slice(i + 1));
    }
    addMergeHistory(arr);
    addCountHistory([false, false, true]);
    addRedBarHistory([0]);
    addPurpleBarHistory(compArr);
    addOnTaskHistory(compArr);

    addMergeHistory(arr);
    addCountHistory([false, false, false]);
    addRedBarHistory([0]);
    addPurpleBarHistory([0]);
    addOnTaskHistory(compArr);
    return (compArr);
  }

  const swapInMerge = (leastIdx, swapIdx) => { //병합 시 병합할 배열의 특정 범위에 원소들을 정렬
    let realIdx1 = 0; //최소값 인덱스
    let realIdx2 = 0; //바꿀 인덱스
    for (let k = 0; k < arr.length; k++) {
      if (arr[k] === leastIdx)
        realIdx1 = k;
      else if (arr[k] === swapIdx)
        realIdx2 = k;
    }
    let tmp = arr[realIdx2];
    arr[realIdx2] = arr[realIdx1];
    arr[realIdx1] = tmp;
  }

  const addMergeHistory = (receivingArr) => { //병합정렬이 진행될 때 배열의 기록
    mergeHistory.push([]);
    for (var j = 0; j < receivingArr.length; j++) {
      mergeHistory[mergeTotalIdx].push(receivingArr[j]);
    }
    mergeTotalIdx++;
  }

  const addRedBarHistory = (arr) => { //그래프 색상을 빨강으로 바꾸는 기록
    redBarHistory.push([]);
    for (var r = 0; r < arr.length; r++) {
      redBarHistory[redBarTotalIdx].push(arr[r]);
    }
    redBarTotalIdx++;
  }

  const addPurpleBarHistory = (arr) => { //그래프 색상을 보라로 바꾸는 기록
    purpleBarHistory.push([]);
    for (var p = 0; p < arr.length; p++) {
      purpleBarHistory[purpleBarTotalIdx].push(arr[p]);
    }
    purpleBarTotalIdx++;
  }

  const addOnTaskHistory = (arr) => { //진행중인 배열의 특정 범위를 표시(해당 범위 외에는 회색, 해당 범위는 색상 초기화)
    onTaskHistory.push([]);
    for (var s = 0; s < arr.length; s++) {
      onTaskHistory[onTaskTotalIdx].push(arr[s]);
    }
    onTaskTotalIdx++;
  }

  const addCountHistory = (compNswap) => { //병합 정렬 시 병합 횟수 증가 기록
    countHistory.push([]);
    for (var c = 0; c < compNswap.length; c++) {
      countHistory[countTotalIdx].push(compNswap[c]);
    }
    countTotalIdx++;
  }

  const addSearchCountHistory = (search) => { //탐색 작업 시 탐색 횟수 증가 기록
    searchCountHistory.push(search);
    searchCountIdx++;
  }

  const mergeTimeLine = async () => { //병합정렬 간 추가된 모든 기록을 순차적으로 표현
    setArr([...arr]);
    for (let i = 0; i < mergeHistory.length; i++) {
      barGrayClear();
      if (countHistory[i][0] === true)
        plusValue(1);
      if (countHistory[i][1] === true)
        plusValue(2);
      if (countHistory[i][2] === true)
        plusValue(3);
      setArr(mergeHistory[i]);

      if (onTaskHistory[i][0] != 0) {//현재 진행중인 bar만 색상 초기화
        for (let s = 0; s < onTaskHistory[i].length; s++) {
          setFreeIdx(onTaskHistory[i][s]);
        }
      }
      if (redBarHistory[i][0] != 0) {
        for (let r = 0; r < redBarHistory[i].length; r++) {
          setCompIdx(redBarHistory[i][r]);
        }
      }
      if (purpleBarHistory[i][0] != 0) {
        for (let p = 0; p < purpleBarHistory[i].length; p++) {
          setNowIdx(purpleBarHistory[i][p]);
        }
      }

      await sleep(375 / taskSpeed);
    }
    barClear();
    buttonOn();
    alert("정렬이 완료되었습니다.");
  }

  const sortStart = async () => { //Header.js에서 정렬 시작 버튼 클릭 시 연결된 함수
    await sleep(100);
    valueClear();

    var speed = getSpeed();
    if (speed === 1) {
      if (arr.length <= 8) {
        taskSpeed = speed / 8;
      } else {
        taskSpeed = speed / 4;
      }
    } else if (speed === 5) {
      taskSpeed = speed * 2 * (arr.length / 5);
    } else {
      taskSpeed = speed * (arr.length / 5);
    }
    await sleep(100);
    switch (sortType) {
      case 1: {
        selectSort();
        break;
      }
      case 2: {
        bubbleSort();
        break;
      }
      case 3: {
        insertionSort();
        break;
      }
      case 4: {
        mergeSort(arr);
        break;
      }
      default:
      //do nothing
    }
  }

  function sortPause() { //Header.js에서 일시정지 버튼 클릭 시 연결된 함수
    alert("정렬이 일시정지 되었습니다. 계속 진행하시려면 확인을 누르세요.");
  }

  const sequentialSearch = async ()  => {//순차 탐색 코드
    valueClear();
    setArr([...arr]);
    
    var speed = getSpeed();
    if (speed === 1) {
      if (arr.length <= 8) {
        taskSpeed = speed / 8;
      } else {
        taskSpeed = speed / 4;
      }
    } else if (speed === 5) {
      taskSpeed = speed * 2 * (arr.length / 5);
    } else {
      taskSpeed = speed * (arr.length / 5);
    }

    var input = prompt("탐색하고자 하는 원소값을 입력하세요"); 
    if(input ==null){//입력값 x
      barClear();
      buttonOn();
      return;
    }else{
      const inputArr = arr;
      let len = inputArr.length;
      let findIdx = -1

      for(var i = 0; i<len;i++){//배열 길이만큼 반복
        if(i!=0){
          setFinished(inputArr[i-1]);
        }
        setNowIdx(inputArr[i]);
        historyUpdate(1, inputArr[i], 0,0);
        plusValue(4);
        setArr([...arr]);
        await sleep(500/taskSpeed);
        if(input==inputArr[i]){
          findIdx=i;
          break;
        }
      }
      if(findIdx>=0){
        await sleep(500);
        setCompIdx(inputArr[findIdx]);
        await sleep(500);
        setFreeIdx(inputArr[findIdx]);
        await sleep(500);
        setCompIdx(inputArr[findIdx]);
        await sleep(500);
        setFreeIdx(inputArr[findIdx]);
        await sleep(500);
        setCompIdx(inputArr[findIdx]);
        await sleep(500);

        barClear();
        buttonOn();
        alert("탐색을 완료하였습니다. "+input+"는 배열 내에서 "+(findIdx+1)+"번째에 존재합니다.");
      }else{
        barClear();
        buttonOn();
        alert("배열의 탐색을 마쳤지만, "+input+"는 배열 내에서 존재하지 않습니다.");
      }
    }
  }

  const binarySearch = async () => {//이진 탐색 코드(병합정렬과 유사하게 작업 내역을 기록해둔 뒤 표현함)
    valueClear();
    historyClear();
    setArr([...arr]);

    var speed = getSpeed();
    if (speed === 1) {
      if (arr.length <= 8) {
        taskSpeed = speed / 8;
      } else {
        taskSpeed = speed / 4;
      }
    } else if (speed === 5) {
      taskSpeed = speed * 2 * (arr.length / 5);
    } else {
      taskSpeed = speed * (arr.length / 5);
    }

    var input = prompt("탐색하고자 하는 원소값을 입력하세요");
    if(input ==null){//입력값 x
      barClear();
      buttonOn();
      return;
    }else{
      var inputArr = arr;
      let len = inputArr.length; //n
      let findIdx = -1;

      let leftIdx = 0;
      let rightIdx = inputArr.length-1;

      let midIdx = Math.floor((leftIdx+rightIdx)/2);

      addSearchCountHistory(false); //초기 탐색값과 중간값을
      addRedBarHistory([inputArr[midIdx]]);
      addPurpleBarHistory([inputArr[leftIdx],inputArr[rightIdx]]);
      addOnTaskHistory(inputArr);

      addSearchCountHistory(false);
      addRedBarHistory([0]);
      addPurpleBarHistory([0]);
      addOnTaskHistory(inputArr);

      addSearchCountHistory(false);
      addRedBarHistory([inputArr[midIdx]]);
      addPurpleBarHistory([inputArr[leftIdx],inputArr[rightIdx]]);
      addOnTaskHistory(inputArr);

      addSearchCountHistory(false);
      addRedBarHistory([0]);
      addPurpleBarHistory([0]);
      addOnTaskHistory(inputArr);

      addSearchCountHistory(true);
      addRedBarHistory([inputArr[midIdx]]);
      addPurpleBarHistory([inputArr[leftIdx],inputArr[rightIdx]]);
      addOnTaskHistory(inputArr); // 표시하기 위한 코드
      
      while(rightIdx>=leftIdx){
        addSearchCountHistory(false);
        addRedBarHistory([inputArr[midIdx]]);
        addPurpleBarHistory([inputArr[leftIdx],inputArr[rightIdx]]);
        addOnTaskHistory(inputArr);

        if(inputArr[midIdx]==input){
          findIdx = midIdx;

          addSearchCountHistory(false);
          addRedBarHistory([inputArr[midIdx]]);
          addPurpleBarHistory([0]);
          addOnTaskHistory([inputArr[midIdx]]);
          break;
        }
        else if(leftIdx == midIdx && rightIdx == midIdx)
          break;
        else if(inputArr[midIdx]>input){//키가 중간값보다 작음
          rightIdx = midIdx-1;

          midIdx = Math.floor((leftIdx+rightIdx)/2);
          
          const tmpArr = [];
          for(let i =leftIdx;i<rightIdx+1;i++){
            tmpArr.push(inputArr[i]);
          }

          addSearchCountHistory(true);
          addRedBarHistory([inputArr[midIdx]]);
          addPurpleBarHistory([inputArr[leftIdx],inputArr[rightIdx]]);
          addOnTaskHistory(tmpArr);
        }
        else{//키가 중간값보다 큼
          if(rightIdx==midIdx+1)
            leftIdx++;
          else
            leftIdx = midIdx+1;

          midIdx = Math.floor((leftIdx+rightIdx)/2);

          const tmpArr = [];
          for(let i =leftIdx;i<rightIdx+1;i++){
            tmpArr.push(inputArr[i]);
          }

          addSearchCountHistory(true);
          addRedBarHistory([inputArr[midIdx]]);
          addPurpleBarHistory([inputArr[leftIdx],inputArr[rightIdx]]);
          addOnTaskHistory(tmpArr);
        }
      }
      binaryTimeLine(input, findIdx);
    }
  }

  const binaryTimeLine = async (input, findIdx) =>{ //이진탐색 간 추가된 모든 기록을 순차적으로 표현
    setArr([...arr]);
    for (let i = 0; i < onTaskHistory.length; i++) {
      barGrayClear();
      if (searchCountHistory[i] === true)
        plusValue(4);

      if(onTaskHistory[i] !=0){
        for(let t = 0; t<onTaskHistory[i].length; t++){
          setFreeIdx(onTaskHistory[i][t]);
        }
      }
      if(purpleBarHistory[i] != 0){
          for(let t = 0;t<purpleBarHistory[i].length;t++){
            setNowIdx(purpleBarHistory[i][t]);
          }
      }
      if(redBarHistory[i] != 0){
        setCompIdx(redBarHistory[i]);
      }
      setArr([...arr]);
      
      if(i<4)
        await sleep(500);
      else if(i==4){
        historyUpdate(2, redBarHistory[i], onTaskHistory[i][0], onTaskHistory[i][onTaskHistory[i].length-1]);
        await sleep(500);
      }
      else if(i%2==1)
        await sleep(500 / taskSpeed);
      else{
        if(i<onTaskHistory.length-1)
          historyUpdate(2, redBarHistory[i], onTaskHistory[i][0], onTaskHistory[i][onTaskHistory[i].length-1]);
        await sleep(750 / taskSpeed);
      }
    }
    if(findIdx>=0){
      setCompIdx(input);
      await sleep(500);
      setFreeIdx(input);
      await sleep(500);
      setCompIdx(input);
      await sleep(500);
      setFreeIdx(input);
      await sleep(500);
      setCompIdx(input);
      await sleep(500);
  
      barClear();
      buttonOn();
      alert("탐색을 완료하였습니다. "+input+"는 배열 내에서 "+(findIdx+1)+"번째에 존재합니다.");
    }else{
      barClear();
      buttonOn();
      alert("배열의 탐색을 마쳤지만, "+input+"는 배열 내에서 존재하지 않습니다.");
    }
  }

  return (
    <div className="App">
      <Header setArray={setArray}
        updateList={updateList}
        rangeChange={rangeChange}
        selectClicked={selectClicked}
        bubbleClicked={bubbleClicked}
        insertClicked={insertClicked}
        mergeClicked={mergeClicked}
        sortStart={sortStart}
        sortPause={sortPause}
        sequentialSearch={sequentialSearch}
        binarySearch={binarySearch}>
        </Header>
      <Main data={arr} currentIdx={curIdx} nextIdx={nexIdx}/>
      <Footer/>
    </div>
  );
}

export default App;
