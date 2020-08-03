import styled from 'styled-components';

export const StyledCell = styled.div`
	background: ${
		props => props.type === 'p' ?
		'green' :
		'grey'
	};
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
		bottom: 0px;
		right: 0px;
		${
			props => props.treasure && `content: "${props.treasure}"` 
		}
	}
`