import styled from 'styled-components';

export const StyledPlayer = styled.div`
	background: url('./chars.png');
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
			props => props.treasure && `content: "${props.treasure}";` 
		}
	}
	border-style: solid;
	animation: glow .5s linear;
`