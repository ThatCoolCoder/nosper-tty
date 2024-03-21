const welcomeMessage = 
`Nosper TTY - Open source terminal-based calculator.

Type "exit" to exit, "help" for help, or "morehelp" for in-depth documentation.
`;

const commandsHelpMessage = 
`Commands:
 exit               Exit the program
 help               Show basic help menu
 morehelp           Show detailed documentation on all functions
 commands           Show this menu
 ang                Display current angle mode
 rad                Switch to radians
 deg                Switch to degrees
 load <set>         Load a set of variables and functions (use listload to see available sets)
 unload <set>       Unload a previously loaded set
 listload           List loadable items
 loadinfo <set>     List data contained within a loadable
 dispnorm           Set display mode to normal
 dispsci <ndigits>  Set display mode to scientific with N digits after the decimal place`

const helpMessage = `
Basic usage
-----------

Type "commands" for a list of special commands for things such as changing angle mode.

Basic operators: 
 Addition:              +
 Subtraction/negation:  -
 Multiplication:        * or x
 Division:              /
 Exponentiation:        ** or ^

The calculator respects order of operations and brackets

Example expressions:
 1 + 2                      = 3
 2 + 3 * 4                  = 14
 (2 + 3) * 4                = 20
 sin 1                      Calc sine of 1
 sin(1 + 2)                 Calc sine of complex expression
 t = sin(1 + 2)             Set variable to value
 m_cow = 500                Set multi-letter variable to value (note: there can only be 1 character before the underscore)
 _favorite_number = 2       Multi letter variable with no character before the underscore
 sqrt t_test                Calc square root of variable
 a = b = 5                  Sets a and b to 5

You can input numbers in a variety of ways:
 10
 0.5
 .5       = 0.5
 5e3      = 5000

Whitespace is largely optional and some functions have abbreviations:
 2+3*4      Same as 2 + 3 * 4
 sin15      Same as sin(15)
 q2         Same as sqrt 2

Multiplication signs can be ommitted in many situations:
 10 (8 + 2)             = 100
 (1 + 2)(2 + 3)         = 15
 sqrt(16)2pi   = 39.985...

Enter "morehelp" for a full reference of functions and features`;

const moreHelpMessage = `
The full help menu is not yet built into this calculator, instead see https://github.com/ThatCoolCoder/nosper-engine/blob/v2/InputLanguage.md
`;

export default {
    welcomeMessage: welcomeMessage,
    helpMessage: helpMessage,
    commandsHelpMessage: commandsHelpMessage,
    moreHelpMessage: moreHelpMessage,
}