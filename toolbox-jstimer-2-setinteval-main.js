"use strict";

//-- Глобальные переменные
//--

var APELSERG = {};

APELSERG.MAIN = {};
APELSERG.MODEL = {};
APELSERG.CANVA = {};
APELSERG.CONFIG = {};
APELSERG.CONFIG.SET = {};
APELSERG.CONFIG.PROC = {};
APELSERG.TOOLBOX = {};

// базовые установки

APELSERG.CONFIG.SET.Version = "0.1.0"

APELSERG.CONFIG.SET.FontSize = 18; // размер шрифта
APELSERG.CONFIG.SET.ResultSizePx = 2; // размер для значения вывода

// дефолтные значения

APELSERG.CONFIG.SET.TypeTimer = "AF";
APELSERG.CONFIG.SET.TimerMsec = 40;
APELSERG.CONFIG.SET.TypePaint = 1;
APELSERG.CONFIG.SET.TypeVirtCalc = 1;

// для настройки канвы

APELSERG.CONFIG.PROC.CanvaID;
APELSERG.CONFIG.PROC.Ctx;
APELSERG.CONFIG.PROC.TimerID = 0;
APELSERG.CONFIG.PROC.TimerID2 = 0;
APELSERG.CONFIG.PROC.Tick = 0;

// для вывода текстовых значений

APELSERG.CONFIG.PROC.SelectTypeTimer = "";
APELSERG.CONFIG.PROC.InputMsec = "";
APELSERG.CONFIG.PROC.SelectTypePaint = "";
APELSERG.CONFIG.PROC.SelectVirtCalc = "";

// для показаний счётчиков

APELSERG.TOOLBOX.prevTotalTime = 0;
APELSERG.TOOLBOX.currTotalTime = 0;
APELSERG.TOOLBOX.prevTotalMsec = 0;
APELSERG.TOOLBOX.currTotalMsec = 0;

APELSERG.TOOLBOX.prevPeriodTime = 0;
APELSERG.TOOLBOX.currPeriodTime = 0;
APELSERG.TOOLBOX.prevPeriodMsec = 0;
APELSERG.TOOLBOX.currPeriodMsec = 0;

APELSERG.TOOLBOX.prevVirtCalcMsec = 0;
APELSERG.TOOLBOX.currVirtCalcMsec = 0;

APELSERG.TOOLBOX.prevPaintMsec = 0;
APELSERG.TOOLBOX.currPaintMsec = 0;

// для сохранения данных счётчиков

APELSERG.TOOLBOX.Total = [];
APELSERG.TOOLBOX.Period = [];
APELSERG.TOOLBOX.VirtCalc = [];
APELSERG.TOOLBOX.Paint = [];

//===
// загрузить страницу при старте
//===
APELSERG.MAIN.OnLoad = function () {

    // настройка канвы под экран

    APELSERG.CONFIG.PROC.CanvaID = document.getElementById('APELSERG_Canvas');
    APELSERG.CONFIG.PROC.CanvaID.style.border = (3).toString() + "px solid silver";
    APELSERG.CONFIG.PROC.Ctx = APELSERG.CONFIG.PROC.CanvaID.getContext('2d');

    APELSERG.CONFIG.PROC.CanvaID.width = window.innerWidth - 50;
    APELSERG.CONFIG.PROC.CanvaID.height = window.innerHeight - 200;

    // установить дефолтные значения

    document.getElementById('APELSERG_SelectTypeTimer').value = APELSERG.CONFIG.SET.TypeTimer;
    document.getElementById('APELSERG_InputMsec').value = APELSERG.CONFIG.SET.TimerMsec;
    document.getElementById('APELSERG_SelectTypePaint').value = APELSERG.CONFIG.SET.TypePaint;
    document.getElementById('APELSERG_SelectVirtCalc').value = APELSERG.CONFIG.SET.TypeVirtCalc;
    document.getElementById('APELSERG_SelectResultSizePx').value = APELSERG.CONFIG.SET.ResultSizePx;

    // отрисовка графика

    APELSERG.CANVA.InitNet();
}

//===
// старт
//===
APELSERG.MAIN.Start = function () {

    // Сброс предыдущих значений

    if (APELSERG.CONFIG.PROC.Tick > 0) {
        if (APELSERG.CONFIG.SET.TypeTimer == "SI" || APELSERG.CONFIG.SET.TypeTimer == "SIAF") {
            window.clearInterval(APELSERG.CONFIG.PROC.TimerID);
        }
        if (APELSERG.CONFIG.SET.TypeTimer == "ST" || APELSERG.CONFIG.SET.TypeTimer == "STAF") {
            window.clearTimeout(APELSERG.CONFIG.PROC.TimerID);
        }
        if (APELSERG.CONFIG.SET.TypeTimer == "AF") {
            window.cancelAnimationFrame(APELSERG.CONFIG.PROC.TimerID);
        }

        clearInterval(APELSERG.CONFIG.PROC.SiTimerID);
    }
    APELSERG.CONFIG.PROC.Tick = 0;
    APELSERG.CONFIG.PROC.SiTimerID = 0;
    
    // Установка новых значений

    APELSERG.CONFIG.SET.TypeTimer = document.getElementById('APELSERG_SelectTypeTimer').value;
    APELSERG.CONFIG.SET.TimerMsec = parseInt(document.getElementById('APELSERG_InputMsec').value);
    APELSERG.CONFIG.SET.TypePaint = parseInt(document.getElementById('APELSERG_SelectTypePaint').value);
    APELSERG.CONFIG.SET.TypeVirtCalc = 1000000 * parseInt(document.getElementById('APELSERG_SelectVirtCalc').value);
    APELSERG.CONFIG.SET.ResultSizePx = parseInt(document.getElementById('APELSERG_SelectResultSizePx').value);

    // Установка новых строк информации

    var idxSelect = 0;

    idxSelect = document.getElementById('APELSERG_SelectTypeTimer').selectedIndex;
    APELSERG.CONFIG.PROC.SelectTypeTimer = " - " + document.getElementById('APELSERG_SelectTypeTimer').options[idxSelect].text;

    if (APELSERG.CONFIG.SET.TypeTimer == "AF") {
        APELSERG.CONFIG.PROC.InputMsec = " - " + "для RAF не устанавливается";
    }
    else {
        APELSERG.CONFIG.PROC.InputMsec = " - " + document.getElementById('APELSERG_InputMsec').value + " мс";
    }

    idxSelect = document.getElementById('APELSERG_SelectTypePaint').selectedIndex;
    APELSERG.CONFIG.PROC.SelectTypePaint = " - " + document.getElementById('APELSERG_SelectTypePaint').options[idxSelect].text;

    idxSelect = document.getElementById('APELSERG_SelectVirtCalc').selectedIndex;
    APELSERG.CONFIG.PROC.SelectVirtCalc = " - " + document.getElementById('APELSERG_SelectVirtCalc').options[idxSelect].text;

    // Старт
    
    APELSERG.MAIN.StartTimer2();

    if (APELSERG.CONFIG.SET.TypeTimer == "SI" || APELSERG.CONFIG.SET.TypeTimer == "SIAF") {
        APELSERG.MAIN.StartTimer();
    }
    else {
        APELSERG.MAIN.Animation();
    }
}

//===
// Рабочий цикл
//===
APELSERG.MAIN.Animation = function () {

    // Тотал

    APELSERG.TOOLBOX.prevTotalTime = APELSERG.TOOLBOX.currTotalTime;
    APELSERG.TOOLBOX.prevTotalMsec = APELSERG.TOOLBOX.currTotalMsec;

    var currTotalDate = new Date();

    APELSERG.TOOLBOX.currTotalTime = currTotalDate.getTime();
    APELSERG.TOOLBOX.currTotalMsec = APELSERG.TOOLBOX.currTotalTime - APELSERG.TOOLBOX.prevTotalTime;

    // Период (завершение)

    APELSERG.TOOLBOX.prevPeriodMsec = APELSERG.TOOLBOX.currPeriodMsec;

    APELSERG.TOOLBOX.stopPeriodTime = APELSERG.TOOLBOX.currTotalTime;
    APELSERG.TOOLBOX.currPeriodMsec = APELSERG.TOOLBOX.stopPeriodTime - APELSERG.TOOLBOX.startPeriodTime;

/*
    // Виртуальная нагрузка

    var startVirtCalcDate = new Date();
    var startVirtCalcTime = startVirtCalcDate.getTime();

    APELSERG.MAIN.VirtCalc();

    var stopVirtCalcDate = new Date();
    var stopVirtCalcTime = stopVirtCalcDate.getTime();

    APELSERG.TOOLBOX.prevVirtCalcMsec = APELSERG.TOOLBOX.currVirtCalcMsec;
    APELSERG.TOOLBOX.currVirtCalcMsec = stopVirtCalcTime - startVirtCalcTime;
*/

    // Отрисовка

    var startPaintDate = new Date();
    var startPaintTime = startPaintDate.getTime();

    if (APELSERG.CONFIG.PROC.Tick == 0) {
        APELSERG.CANVA.InitNet();
    }
    else {
        if (APELSERG.CONFIG.SET.TypePaint == 0) {
            APELSERG.CANVA.Paint();
        }
        else {
            APELSERG.CANVA.PaintComplex();
        }
    }

    var stopPaintDate = new Date();
    var stopPaintTime = stopPaintDate.getTime();

    APELSERG.TOOLBOX.prevPaintMsec = APELSERG.TOOLBOX.currPaintMsec;
    APELSERG.TOOLBOX.currPaintMsec = stopPaintTime - startPaintTime;

    // Сохранение результатов (учитывается в общем цикле Total)
    // Используется для режима с видеонагрузкой

    if (APELSERG.CONFIG.PROC.Tick == 0) {
        APELSERG.TOOLBOX.Total = [];
        APELSERG.TOOLBOX.Period = [];
        APELSERG.TOOLBOX.VirtCalc = [];
        APELSERG.TOOLBOX.Paint = [];
    }
    else {
        if (APELSERG.CONFIG.SET.TypePaint != 0) {
            APELSERG.TOOLBOX.Total.push(new APELSERG.MODEL.Values("TOTAL", APELSERG.CONFIG.PROC.Tick, APELSERG.TOOLBOX.prevTotalMsec, APELSERG.TOOLBOX.currTotalMsec));
            APELSERG.TOOLBOX.Period.push(new APELSERG.MODEL.Values("PERIOD", APELSERG.CONFIG.PROC.Tick, APELSERG.TOOLBOX.prevPeriodMsec, APELSERG.TOOLBOX.currPeriodMsec));
            APELSERG.TOOLBOX.VirtCalc.push(new APELSERG.MODEL.Values("VIRTCALC", APELSERG.CONFIG.PROC.Tick, APELSERG.TOOLBOX.prevVirtCalcMsec, APELSERG.TOOLBOX.currVirtCalcMsec));
            APELSERG.TOOLBOX.Paint.push(new APELSERG.MODEL.Values("PAINT", APELSERG.CONFIG.PROC.Tick, APELSERG.TOOLBOX.prevPaintMsec, APELSERG.TOOLBOX.currPaintMsec));
        }
    }

    // Период (старт)

    var startPeriodDate = new Date();
    APELSERG.TOOLBOX.startPeriodTime = startPeriodDate.getTime();

    APELSERG.CONFIG.PROC.Tick++;
    if (APELSERG.CONFIG.PROC.Tick < APELSERG.CONFIG.PROC.CanvaID.width) {

        if (APELSERG.CONFIG.SET.TypeTimer == "ST") {
            APELSERG.CONFIG.PROC.TimerID = window.setTimeout(function () {
                APELSERG.MAIN.Animation();
            }, APELSERG.CONFIG.SET.TimerMsec);
        }

        if (APELSERG.CONFIG.SET.TypeTimer == "STAF") {
            APELSERG.CONFIG.PROC.TimerID = window.setTimeout(function () {

                window.requestAnimationFrame(function () {
                    APELSERG.MAIN.Animation();
                });

            }, APELSERG.CONFIG.SET.TimerMsec);
        }

        if (APELSERG.CONFIG.SET.TypeTimer == "AF") {
            APELSERG.CONFIG.PROC.TimerID = window.requestAnimationFrame(function () {
                APELSERG.MAIN.Animation();
            });
        }
    }
}

//===
// Таймер
//===
APELSERG.MAIN.StartTimer = function () {
    APELSERG.CONFIG.PROC.TimerID = window.setInterval(function () {
        if (APELSERG.CONFIG.PROC.Tick < APELSERG.CONFIG.PROC.CanvaID.width) {
            if (APELSERG.CONFIG.SET.TypeTimer == "SI") {
                APELSERG.MAIN.Animation();
            }
            if (APELSERG.CONFIG.SET.TypeTimer == "SIAF") {
                window.requestAnimationFrame(function () {
                    APELSERG.MAIN.Animation();
                });
            }
        }
        else {
            clearInterval(APELSERG.CONFIG.PROC.TimerID);
        }
    }, APELSERG.CONFIG.SET.TimerMsec);
}


//===
// Таймер (конкурентный - псевдонагрузка в нём)
//===
APELSERG.MAIN.StartTimer2 = function () {
    APELSERG.CONFIG.PROC.TimerID2 = window.setInterval(function () {
        if (APELSERG.CONFIG.PROC.Tick < APELSERG.CONFIG.PROC.CanvaID.width) {

          // Виртуальная нагрузка

          var startVirtCalcDate = new Date();
          var startVirtCalcTime = startVirtCalcDate.getTime();

          APELSERG.MAIN.VirtCalc();

          var stopVirtCalcDate = new Date();
          var stopVirtCalcTime = stopVirtCalcDate.getTime();

          APELSERG.TOOLBOX.prevVirtCalcMsec = APELSERG.TOOLBOX.currVirtCalcMsec;
          APELSERG.TOOLBOX.currVirtCalcMsec = stopVirtCalcTime - startVirtCalcTime;

        }
        else {
            clearInterval(APELSERG.CONFIG.PROC.TimerID2);
        }
    }, APELSERG.CONFIG.SET.TimerMsec);
}

//===
// Функция виртуальной нагрузки
// Здесь можно разместить произвольный код для тестирования
//===
APELSERG.MAIN.VirtCalc = function () {
    for (var n = 0; n < APELSERG.CONFIG.SET.TypeVirtCalc ; n++) {
        var q = Math.round(Math.random() * 100);
    }
}
