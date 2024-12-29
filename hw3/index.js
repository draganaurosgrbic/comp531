window.onload = () => {
    setBoardSize();

    hideDialog();
    initBoard();
    updateCurrentShape();

    loadGameMetrics();
    updateGameMetrics();

    registerDialogPopdown();
}
