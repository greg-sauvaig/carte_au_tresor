import styled from 'styled-components';

export const StyledButton = styled.div`
	background-color: var(--background);
	display: block;
	cursor: pointer;
	padding: 10px 15px;
	margin: 0 auto;
	border: 3px solid var(--primary);
	color: var(--primary);
	box-shadow: 2px -2px 0 -3px var(--background), 2px -2px var(--green),
		4px -4px 0 -3px var(--background), 4px -4px var(--yellow);
`