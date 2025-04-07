local ____lualib = require("lualib_bundle")
local __TS__Delete = ____lualib.__TS__Delete
function main(self)
    local bob = {1, 2, 3, 4}
    __TS__Delete(bob, 4)
    return bob
end
main(_G)
