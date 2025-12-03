export function calculateEmblems(workouts, prData){

    const trainingSymbols = {
        firstTrainingSymbol: null, 
        fiveTrainingsSymbol: null, 
        benchSymbol: null,
        fiveKmRun: null
    }

    const firstTrainingPicture = "1_training_symbol.png"; 
    const fiveTrainingsPicture = "5_trainings_symbol.png"; 
    const benchSymbolPicture = "bench_press_symbol.png"; 
    const fiveKmRunPicture = "running_symbol.png"

    if (workouts.length > 0 ) {
        trainingSymbols.firstTrainingSymbol = firstTrainingPicture; 
    }

    if (workouts.length >= 5 ) {
        trainingSymbols.fiveTrainingsSymbol = fiveTrainingsPicture; 
    }

    if (prData && prData.bench_press_kg) {
        const benchPressKg = Number(prData.bench_press_kg);

        if (benchPressKg >= 100) {
            trainingSymbols.benchSymbol = benchSymbolPicture;
        }
    };

    if (prData && prData.run_5k_min) {
        const runRecord = Number(prData.run_5k_min);

        if (runRecord < 25) {
            trainingSymbols.fiveKmRun = fiveKmRunPicture;
        }

    };

    return trainingSymbols; 
}

export function getEmblemDescription(key) {
    switch (key) {
        case 'firstTrainingSymbol':
            return "You posted your first workout!";
        case 'fiveTrainingsSymbol':
            return "You posted five workouts!";
        case 'benchSymbol':
            return "You did a 100kg bench press!";
        case 'fiveKmRun':
            return "You ran a 5 k in under 25 minutes!";
        default:
            return "No emblem";
    }
}