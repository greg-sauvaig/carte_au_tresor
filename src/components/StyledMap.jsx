import styled from 'styled-components';

export const StyledMap = styled.div`
	background: black;
	width: auto;
	border: 1px solid white;
	box-shadow: 1px 1px 2px 1px #1a1a1a;
	border-color: white;
	user-select: none;
	padding: 4px;
	min-height: 16px;
	min-width: 16px;
	border-radius: 6px;
	display: grid;
	grid-template-rows: repeat(
		${props => props.height},
		16px
	);
	grid-template-columns: repeat(
		${props => props.width},
		16px
	);
	grid-gap: 1px;
`