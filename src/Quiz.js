import React, { useEffect } from 'react';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import FormControlLabel from '@material-ui/core/FormControlLabel';

import FormLabel from '@material-ui/core/FormLabel';


import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Icon from '@material-ui/core/Icon';

import { shuffle } from './helpers'

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);



const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),

    },
    selectionContainer: {
        display: "flex",
        justifyContent: 'space-around'

    },
    correctAnswer: {
        color: 'green',

    },
    table: {
        maxHeight: '100px',
    },
}));

function getSteps() {
    return ['Choose Quiz Type', 'Quiz'];
}

// function getStepContent(step) {
//     switch (step) {
//         case 0:
//             return `For each ad campaign that you create, you can control how much
//               you're willing to spend on clicks and conversions, which networks
//               and geographical locations you want your ads to show on, and more.`;
//         case 1:
//             return 'An ad group contains one or more ads which target a shared set of keywords.';
//         case 2:
//             return `Try out different ad text to see what brings in the most customers,
//               and learn how to enhance your ads using features like ad extensions.
//               If you run into any problems with your ads, find out how to tell if
//               they're running and how to resolve approval issues.`;
//         default:
//             return 'Unknown step';
//     }
// }

export default function Quiz() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();
    const [questionsCount, setQuestionsCount] = React.useState(10)
    const [type, setType] = React.useState('multiple');
    const [difficulty, setDifficulty] = React.useState('easy');
    const [questions, setQuestions] = React.useState([])
    const [loading, setLoading] = React.useState(false);
    const [currentQuestion, setCurrentQuestion] = React.useState(0)
    const [selectedAnswer, setSelectedAnswer] = React.useState('')

    useEffect(() => {

        async function fetchQuestions() {
            try {
                setLoading(true);
                const response = await fetch(
                    `https://opentdb.com/api.php?amount=${questionsCount}&difficulty=${difficulty}&type=${type}`
                )
                const json = await response.json();
                const resultsFormat = json.results.map(question => {
                    return {
                        question: question['question'],
                        options: shuffle([question['correct_answer'], ...question['incorrect_answers']]),
                        correctAnswer: question['correct_answer']
                    }
                })
                setQuestions(resultsFormat)
                setLoading(false)
            } catch (error) {
                setLoading(false);
            }
        }
        fetchQuestions()
    }, [type, difficulty, questionsCount])
    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setQuestions([])
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleReset = () => {
        setCurrentQuestion(0)
        setQuestionsCount(0)
        setActiveStep(0);
    };


    const handleChange = event => {
        setQuestionsCount(event.target.value);
    };



    const handleChangeType = event => {
        setType(event.target.value);
    };

    const handleChangeDifficulty = event => {
        setDifficulty(event.target.value)
    }

    const handleNextQuestion = () => {

        const isCorrectAnswer = questions[currentQuestion]['correctAnswer'] === selectedAnswer

        if (isCorrectAnswer) { }

        const questionsLength = questions.length
        if (currentQuestion < questionsLength) {
            setCurrentQuestion(currentQuestion + 1)
        }
    }

    const handleAnswerChange = event => {
        setSelectedAnswer(event.target.value)
    }


    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            {index === 0 && (< div className={classes.selectionContainer}>
                                <div>
                                    <FormControl required className={classes.formControl}>
                                        <InputLabel id="demo-simple-select-helper-label"> Questions </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-helper-label"
                                            id="demo-simple-select-helper"
                                            value={questionsCount}
                                            onChange={handleChange}
                                        >

                                            <MenuItem value={10}>Ten</MenuItem>
                                            <MenuItem value={20}>Twenty</MenuItem>
                                            <MenuItem value={30}>Thirty</MenuItem>
                                            <MenuItem value={40}>Forty</MenuItem>
                                            <MenuItem value={50}>Fifty</MenuItem>

                                        </Select>
                                        <FormHelperText>no of questions to play</FormHelperText>
                                    </FormControl>
                                </div>
                                <div>
                                    <FormLabel component="legend">Answer Type</FormLabel>
                                    <RadioGroup aria-label="gender" name="gender1" value={type} onChange={handleChangeType}>
                                        <FormControlLabel value="multiple" control={<Radio />} label="Multiple Choice (Pick One)" />
                                        <FormControlLabel value="boolean" control={<Radio />} label="True /False" />
                                    </RadioGroup>

                                </div>
                                <div>
                                    <FormLabel component="legend">Difficulty</FormLabel>
                                    <RadioGroup aria-label="difficulty" name="difficulty" value={difficulty} onChange={handleChangeDifficulty}>
                                        <FormControlLabel value="easy" control={<Radio />} label="Easy" />
                                        <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                                        <FormControlLabel value="hard" control={<Radio />} label="Hard" />
                                    </RadioGroup>

                                </div>
                            </div>)} {
                                index === 1 && (<div>
                                    {loading && <CircularProgress />}
                                    <Card>
                                        <CircularProgress variant="static" value={Number((currentQuestion + 1) * 100 / questions.length)} />
                                        <CardContent>
                                            {questions.length > 0 && (<div>
                                                {currentQuestion + 1}
                                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                    {renderHTML(questions[currentQuestion]['question'])}
                                                </Typography>


                                                <RadioGroup aria-label="gender" name="gender1" value={selectedAnswer} onChange={handleAnswerChange}>
                                                    {questions[currentQuestion]['options'].map(answer => {

                                                        return (
                                                            <FormControlLabel key={answer} value={answer} control={<Radio />} label={answer} />)

                                                    })}

                                                </RadioGroup>
                                            </div>)}






                                        </CardContent>
                                        <CardActions>

                                            {currentQuestion === questions.length - 1 ? <Button size="small">Done</Button> : <Button size="small" onClick={handleNextQuestion}>Next</Button>}
                                        </CardActions>
                                    </Card>

                                </div>)
                            }


                            <div className={classes.actionsContainer}>
                                <div>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        className={classes.button}
                                    >
                                        Back
                  </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        className={classes.button}
                                    >
                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                    </Button>
                                </div>
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} className={classes.resetContainer}>
                    <Typography> you&apos;re finished , View results </Typography>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Question</StyledTableCell>
                                    <StyledTableCell align="right">Status</StyledTableCell>
                                    <StyledTableCell align="right">Correct</StyledTableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {questions.map(row => (
                                    <StyledTableRow key={row.question}>
                                        <StyledTableCell component="th" scope="row">
                                            <Typography>{renderHTML(row.question)}</Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="right"><Icon style={{ color: 'green' }}>highlight_off</Icon></StyledTableCell>
                                        <StyledTableCell align="right">{row.correctAnswer}</StyledTableCell>

                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button onClick={handleReset} className={classes.button}>
                        Reset
          </Button>
                </Paper>
            )}
        </div>
    );
}
