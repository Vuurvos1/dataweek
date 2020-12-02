import { select } from 'd3'

export const tooltip = select('body')
  .append('div')
  .style('position', 'absolute')
  .style('z-index', '10')
  .style('visibility', 'hidden')
  .attr('class', 'tooltip')

export const handleMouseOver = (info) => {
  tooltip.append('p').text(info), tooltip.style('visibility', 'visible')
}

export const mouseMove = (event) => {
  tooltip
    .style('top', event.pageY - 10 + 'px')
    .style('left', event.pageX + 10 + 'px')
}

export const handleMouseOut = () => {
  tooltip.style('visibility', 'hidden')
  tooltip.selectAll('p').remove()
}
