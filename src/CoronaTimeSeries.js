

import React, { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';


const dataUrl = "https://pomber.github.io/covid19/timeseries.json"
const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    {
        title: 'The Godfather: Part II', year: 197
    }]

const renderLineChart = (res) => (

    <LineChart
        width={1080}
        height={400}
        data={res}
        margin={{
            top: 5, right: 30, left: 20, bottom: 5,
        }}
    >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="deaths" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="recovered" stroke="#82ca9d" />
        <Line type="monotone" dataKey="confirmed" stroke="#223344" />
    </LineChart>

);


export default () => {
    const [response, setResponse] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState('US')
    useEffect(() => {

        async function getData() {
            try {
                let response = await fetch(dataUrl);
                let responseJson = await response.json();
                setResponse(responseJson)
                setIsLoading(false)
            } catch (error) {
                console.error(error);
            }
        }
        getData()

    }, []); // <-- Have to pass in [] here!

    const handleChange = (event, value) => {
        if (value)
            setSelectedCountry(value.title)
    }


    const countries = Object.keys(response).map(item => ({ title: item }))



    return (
        <div >{isLoading && <p>Wait I'm Loading comments for you</p>}
            <Autocomplete
                id="combo-box-demo"
                options={countries}
                getOptionLabel={(option) => option.title}
                style={{ width: 300 }}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} label="Choose A Country" variant="outlined" />}
            />
            {selectedCountry && response[selectedCountry] && <div> {response[selectedCountry].slice(-1)[0]['recovered']}</div>}
            <br />
            {selectedCountry && response[selectedCountry] && renderLineChart(response[selectedCountry])}</div>
    );
}