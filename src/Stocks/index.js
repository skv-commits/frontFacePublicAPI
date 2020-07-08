import React, { useState, useEffect } from 'react';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import request from 'request';
import axios from 'axios';

const sleep = (delay = 0) => {
	return new Promise(resolve => {
		setTimeout(resolve, delay);
	});
};

const Stocks = () => {
	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState([]);

	const loading = open && options.length === 0;
	const [searchTerm, setSearchTerm] = useState('A');

	const fetchNewList = async searchTerm => {
		const response = await axios(
			`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchTerm}&apikey=93MQSOJHDKEFH4KX`
		);
		const matches = response.data.bestMatches.map(item => ({
			name: item['1. symbol']
		}));
		console.log(matches);
		setOptions(matches);
	};

	useEffect(
		() => {
			let active = true;
			if (!loading) {
				return undefined;
			}

			fetchNewList(searchTerm);

			return () => {
				active = false;
			};
		},
		[loading, searchTerm]
	);

	useEffect(
		() => {
			if (!open) {
				setOptions([]);
			}
		},
		[open]
	);
	return (
		<div>
			<Autocomplete
				id="asynchronous-demo"
				style={{ width: 300 }}
				open={open}
				onChange={(event, newValue) => {
					//          setSearchTerm(newValue.name);
				}}
				onKeyUp={(event, newValue) => {
					setSearchTerm(event.target.value);
					console.log('key', event.target.value, newValue);
				}}
				onOpen={() => {
					setOpen(true);
				}}
				onClose={() => {
					setOpen(false);
				}}
				getOptionSelected={(option, value) => {
					console.log('Get OptionSelected', option, value);
					return option.name === value.name;
				}}
				getOptionLabel={option => {
					//  console.log("--", option);
					return option.name;
				}}
				options={options}
				loading={loading}
				renderInput={params => (
					<TextField
						{...params}
						label="Asynchronous"
						variant="outlined"
						InputProps={{
							...params.InputProps,
							endAdornment: (
								<React.Fragment>
									{loading ? <CircularProgress color="inherit" size={20} /> : null}
									{params.InputProps.endAdornment}
								</React.Fragment>
							)
						}}
					/>
				)}
			/>
		</div>
	);
};

export default Stocks;
