"use strict";

//===
// Отрисовка сетки
//===
APELSERG.CANVA.InitNet = function () {

    var ctx = APELSERG.CONFIG.PROC.Ctx;

    // Очистка

    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, APELSERG.CONFIG.PROC.CanvaID.width, APELSERG.CONFIG.PROC.CanvaID.height);

    // Сетка

    ctx.fillStyle = "white";
    ctx.font = APELSERG.CONFIG.SET.FontSize.toString() + "px Arial";

    ctx.strokeStyle = "lightgray";
    ctx.lineWidth = 0.2;

    for (var rCnt = 0, nRow = APELSERG.CONFIG.PROC.CanvaID.height ; nRow > 0; nRow -= 50, rCnt += 50) {
        ctx.beginPath();
        ctx.moveTo(0, nRow);
        ctx.lineTo(APELSERG.CONFIG.PROC.CanvaID.width, nRow);
        ctx.stroke();

        ctx.fillText(rCnt.toString() + "мс", APELSERG.CONFIG.PROC.CanvaID.width - 80, APELSERG.CONFIG.PROC.CanvaID.height - rCnt);
    }

    for (var nCol = 0 ; nCol < APELSERG.CONFIG.PROC.CanvaID.width; nCol += 50) {
        ctx.beginPath();
        ctx.moveTo(nCol,0);
        ctx.lineTo(nCol, APELSERG.CONFIG.PROC.CanvaID.height);
        ctx.stroke();

        ctx.fillText(nCol.toString(), nCol, 30);
    }

    // Инфо

    APELSERG.CANVA.PaintCycleBox(ctx);
    APELSERG.CANVA.PaintInfoBox(ctx);
}
//===
// Простая отрисовка только новых значений без очистки канвы
// Примечание: на момент прорисовки currPaintMsec относится к предыдущему циклу
//===
APELSERG.CANVA.Paint = function () {

    var fixOut = 3;
    var ctx = APELSERG.CONFIG.PROC.Ctx;
    var px = APELSERG.CONFIG.SET.ResultSizePx;

    ctx.fillStyle = "red";
    ctx.fillRect(APELSERG.CONFIG.PROC.Tick, APELSERG.CONFIG.PROC.CanvaID.height - APELSERG.TOOLBOX.prevTotalMsec - fixOut, px, px);

    ctx.fillStyle = "white";
    ctx.fillRect(APELSERG.CONFIG.PROC.Tick, APELSERG.CONFIG.PROC.CanvaID.height - APELSERG.TOOLBOX.prevPeriodMsec - fixOut, px, px);

    ctx.fillStyle = "cyan";
    ctx.fillRect(APELSERG.CONFIG.PROC.Tick, APELSERG.CONFIG.PROC.CanvaID.height - APELSERG.TOOLBOX.prevVirtCalcMsec - fixOut, px, px);

    ctx.fillStyle = "blue";
    ctx.fillRect(APELSERG.CONFIG.PROC.Tick, APELSERG.CONFIG.PROC.CanvaID.height - APELSERG.TOOLBOX.currPaintMsec - fixOut, px, px);

    APELSERG.CANVA.PaintCycleBox(ctx);
}
//===
// При каждом цикле перересовывается сетка и все сохранённые значения
// Для моделирования нагрузки
//===
APELSERG.CANVA.PaintComplex = function () {

    var fixOut = 3;
    var ctx = APELSERG.CONFIG.PROC.Ctx;
    var px = APELSERG.CONFIG.SET.ResultSizePx;

    APELSERG.CANVA.InitNet();

    ctx.fillStyle = "red";
    for (var n in APELSERG.TOOLBOX.Total) {
        var item = APELSERG.TOOLBOX.Total[n];
        ctx.fillRect(item.Tick, APELSERG.CONFIG.PROC.CanvaID.height - item.Curr - fixOut, px, px);
    }

    ctx.fillStyle = "white";
    for (var n in APELSERG.TOOLBOX.Period) {
        var item = APELSERG.TOOLBOX.Period[n];
        ctx.fillRect(item.Tick, APELSERG.CONFIG.PROC.CanvaID.height - item.Curr - fixOut, px, px);
    }
    
    ctx.fillStyle = "cyan";
    for (var n in APELSERG.TOOLBOX.VirtCalc) {
        var item = APELSERG.TOOLBOX.VirtCalc[n];
        ctx.fillRect(item.Tick, APELSERG.CONFIG.PROC.CanvaID.height - item.Curr - fixOut, px, px);
    }

    ctx.fillStyle = "blue";
    for (var n in APELSERG.TOOLBOX.Paint) {
        var item = APELSERG.TOOLBOX.Paint[n];
        ctx.fillRect(item.Tick, APELSERG.CONFIG.PROC.CanvaID.height - item.Curr - fixOut, px, px);
    }

    APELSERG.CANVA.PaintCycleBox(ctx);
    APELSERG.CANVA.PaintInfoBox(ctx);
}
//===
// Показать количество циклов
//===
APELSERG.CANVA.PaintCycleBox = function (ctx) {

    var placeX = 2;
    var placeY = 35;

    ctx.fillStyle = "darkgray";
    ctx.fillRect(placeX, placeY, 100, 30);

    ctx.fillStyle = "white";
    ctx.font = APELSERG.CONFIG.SET.FontSize.toString() + "px Arial";
    ctx.fillText(APELSERG.CONFIG.PROC.Tick.toString(), placeX + 10, placeY + 22);
}
//===
// Инфо
//===
APELSERG.CANVA.PaintInfoBox = function (ctx) {

    var placeX = 2;
    var placeY = 35;

    ctx.font = APELSERG.CONFIG.SET.FontSize.toString() + "px Arial";

    // тип таймера

    ctx.fillStyle = "red";
    ctx.fillRect(placeX, 2 * placeY, 30, 30);

    ctx.fillStyle = "white";
    ctx.fillText("Фактическое время от одного вызова до другого" + APELSERG.CONFIG.PROC.SelectTypeTimer, placeX + 10 + 30, 2 * placeY + 22);

    // задержка таймера
    
    ctx.fillStyle = "white";
    ctx.fillRect(placeX, 3 * placeY, 30, 30);

    ctx.fillStyle = "white";
    ctx.fillText("Установленное время периода" + APELSERG.CONFIG.PROC.InputMsec, placeX + 10 + 30, 3 * placeY + 22);

    // тип видеонагрузки

    ctx.fillStyle = "blue";
    ctx.fillRect(placeX, 4 * placeY, 30, 30);

    ctx.fillStyle = "white";
    ctx.fillText("Видеонагрузка" + APELSERG.CONFIG.PROC.SelectTypePaint, placeX + 10 + 30, 4 * placeY + 22);

    // тип псевдонагрузки

    ctx.fillStyle = "cyan";
    ctx.fillRect(placeX, 5 * placeY, 30, 30);

    ctx.fillStyle = "white";
    ctx.fillText("Псевдонагрузка" + APELSERG.CONFIG.PROC.SelectVirtCalc, placeX + 10 + 30, 5 * placeY + 22);
}