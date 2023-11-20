const welcomeMessage = 
`Nosper TTY - Open source terminal-based calculator.

Type "exit" to exit, "help" for help, or "morehelp" for in-depth documentation.
`;

const commandsHelpText = 
`Commands:
 exit               Exit the program
 help               Show this menu
 morehelp           Show detailed documentation on all functions
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

${commandsHelpText}

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
 $myvalue = sin(1 + 2)      Set variable to value
 sqrt $myvalue              Calc square root of variable
 $a = $b = 5                Sets a and b to 5


You can input numbers in a variety of ways:
 10
 0.5
 .5         = 0.5
 5 * e3     = 5000

Whitespace is largely optional and some functions have abbreviations:
 2+3*4      Same as 2 + 3 * 4
 sin15      Same as sin(15)
 q2         Same as sqrt 2

Multiplication signs can be ommitted in many situations:
 10 (8 + 2)             = 100
 (1 + 2)(2 + 3)         = 15
 sqrt(16)2$pi   = 39.985...

Multiple expressions can be put on one line by separating them with semicolons (the value of the last expression is the one returned):
 3 * 3; 4 * 4       = 16
 $x = 3; $x^2       = 9

Enter "morehelp" for a full reference of functions and features`;

const moreHelpMessage = `
Detailed documentation
----------------------

${commandsHelpText}

Operators: 
 Addition:                  +
 Subtraction/negation:      -
 Multiplication:            * or x
 Division:                  /
 Division - low precedence  //      (evaluated with same precedence as addition;
                                     useful for constructing fractions)
 Modulo:                    %
 Exponentiation:            ** or ^
 If                         ?       (if the left hand value > 0, it evaluates to the right hand value. Else 0)
 Not if                     !?      (like if but evaluates to RHS when LHS equals 0)

Input:
 Type an expression and press enter.

 Multiple expressions:
  Multiple expressions can be put on one line by separating them with semicolons
  The value of the last expression is the one returned.
  For example:
   3 * 3; 4 * 4       = 16

Memory:
 Variables:
  Variables are referred to by putting a dollar sign in front of their name
  Assign a variable like so:                    $varname = 10
  It can then be used in further calculations:  $varname * 2
 
 Custom functions:
  Functions are defined somewhat similarly to variable assignment: $calc_area => $0 * $1
   To read argument N, use the notation $N
   For example, the first argument is $0 and the second is $1
  Call a function like so: &calc_area(45, 10)
   Pass arguments into the function by putting them inside brackets, separated by commas

 Previous answer:
  Type "ans" to read the previous answer. It can be used anywhere a variable or number could be written.
  Note that if you enter multiple expressions separated by a semicolon, ans is only updated at the end of the set of expressions.
  For example, if you entered the following expression groups one after each other, the results would be
   5 + 5            = 10
   2 + 2; ans + 2   = 12 (not 6)

Inbuilt constants (predefined variables):
 Pi                     $pi     3.141...
 Tau                    $tau    6.283...
 Phi (Golden ratio)     $phi    1.618...
 Silver ratio           $silv   2.414...

Inbuilt functions (shown with example inputs):
 Trigonometry:
   Sine         sin 45
   Arc sine     asin 1
   Cosine       cos 45
   Arc cosine   acos 45
   Tangent      tan 45
   Arc tangent  atan 45
 
 Roots:
  Square root   sqrt 2  or  q 2
  Cube root     cbrt 8  or  c 8

 Other:
  Absolute value            abs -1
  Logarithm (base 10)       log 250
  Natural logarithm         ln 10
  Round value either way    round 0.64
  Round down                floor 0.77
  Round up                  ceil 4.55
`;

export default {
    welcomeMessage: welcomeMessage,
    helpMessage: helpMessage,
    moreHelpMessage: moreHelpMessage,
}