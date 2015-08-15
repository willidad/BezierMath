/// <reference path="./../typings/tsd.d.ts" />

import { computeIntersections } from './generators/helpers/intersect'
import * as bezier from './bezierFunctions'

export function main() {
	
	var regex = /(?:(M|Q|C|S)([\d|,|\.|\s]+))/g

	var svg = d3.select('svg')
	var points = [	
		[200,400],
		[300,400],
		[400,400],
		[500,400]
	]
	
	var path = svg.append('path')
		.style({stroke:'black', fill:'none', 'stroke-width':3})
	
	
	
	
	var drag = d3.behavior.drag()
		.origin( function(d) { return {x:d[0], y:d[1]} } )
		.on('drag', dragPoint)
		
	svg.on('mousemove', mouseMove)
	d3.select('#cubic').on('click', function() {
		points = [	
			[200,400],
			[300,600],
			[400,600],
			[500,400]
		]
		draw()
	})
	
	d3.select('#lin').on('click', function() {
		points = [	
			[200,400],
			[300,400],
			[400,400],
			[500,400]
		]
		draw()
	})
	
	d3.select('#quad').on('click', function() {
		points = bezier.quadToCubic([200,400],[450,600],[500,400])
		draw()
	})
	
	var inters,
		cp,
		lines
	
	function mouseMove(ev) {
		var x = d3.mouse(svg.node())[0]
		var px = points.map(function (p) { return p[0]})
		var t = bezier.computeBezierIntersection (x, px)
		inters = svg.selectAll('.inters').data(
			<any>t.map(function(tx:number) { return bezier.computePoint(tx, points) }), 
			<any>function(d,i) { return i }
		)
		inters.enter().append('circle').attr('class', 'inters')
			.attr('r', 5)
			.style({'fill':'blue'})
		inters
			.attr('cx', function(pt) { return pt[0] })
			.attr('cy', function(pt) { return pt[1] })
		inters.exit().remove()

	}
		
	function dragPoint(d) {
		d3.select(this)
			.attr('cx', d[0] = d3.event.x)
			.attr('cy', d[1] = d3.event.y)
		path.attr('d', `M${points[0].join()}C${points.slice(1).join()}`)
		drawLines()
	}
	
	function drawLines() {
		lines = svg.selectAll('line').data([points.slice(0,2), points.slice(2)])
		lines.enter().append('line')
			.style('stroke','black')
		lines
			.attr('x1', function(d) { return d[0][0] })
			.attr('y1', function(d) { return d[0][1] })
			.attr('x2', function(d) { return d[1][0] })
			.attr('y2', function(d) { return d[1][1] })
		lines.exit().remove
	}
	
	function draw() {
		path.attr('d', `M${points[0].join()}C${points.slice(1).join()}`)
		cp = svg.selectAll('circle').data(points)
		cp.enter().append('circle')
			.style({stroke:'grey', 'stroke-width':3, 'fill-opacity':0.5})
			.attr('r',10)
			.call(drag)
		cp
			.attr('cx',function(d) { return d[0]})
			.attr('cy',function(d) { return d[1]})
			.style('fill', function(d,i) { return i === 0 ||i === 3 ? 'green' : 'red'})
		cp.exit().remove()
		
		drawLines()
			
	}
	draw()
}	