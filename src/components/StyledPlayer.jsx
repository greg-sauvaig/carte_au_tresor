import styled from 'styled-components';

const top = [96, props => props.index % 4 * 32];
const right = [64, props => props.index % 4 * 32];
const bottom = [0, props => props.index % 4 * 32];
const left = [32, props => props.index % 4 * 32];

export const StyledPlayer = styled.div`
	background: url('./chars.png');
	background-position: ${
		bottom[0],
		bottom[1]
	};
	background-size: 192px;
	width: 16px;
	height: 16px;
	user-select: none;
	padding: 1px;
	min-height: 16px;
	min-width: 16px;
	position: relative;
	&:after {
		position: absolute;
		font-size: 8px;
		top: 0px;
		left: 0px;
		${
			props => props.treasure && `content: "${props.treasure}"` 
		}
	}
`