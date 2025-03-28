LOVELY_INTEGRITY = '1e2499c2cbb65ceeb296ebe91a714618872b984ad4b5e7e9df6735355bc2371f'

_RELEASE_MODE = true
_DEMO = false

function love.conf(t)
	t.console = not _RELEASE_MODE
	t.title = 'Balatro'
	t.window.width = 0
    t.window.height = 0
	t.window.minwidth = 100
	t.window.minheight = 100
end 
