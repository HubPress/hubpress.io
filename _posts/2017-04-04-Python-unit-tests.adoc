= Python unit tests
:hp-tags: python, unit tests

==== Why ?

You know why because if you don't what are you doing here ? 

==== Using unittest library

===== A basic example : 

[source,python]
----
import unittest

def f1(a, b):
    return a + b

class TestF1(unittest.TestCase):
    '''
    This class will test f1
    '''

    def test_f1(self):
        res = f1(2, 4)
        self.assertEqual(res, 6)

if __name__ == '__main__':
    unittest.main()
----

And this will result in :

----
Ran 1 test in 0.001s
OK
----

===== What happens if the test fails : 

[source, python]
----
	# modify the value in the assertEqual
	def test_f1(self):
        res = f1(2, 4)
        self.assertEqual(res, 3)
----

The output is now : 

----
======================================================================
FAIL: test_f1 (tmp.TestF1)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\Users\rhz\PycharmProjects\panda\tmp.py", line 16, in test_f1
    self.assertEqual(res, 3)
AssertionError: 6 != 3

----------------------------------------------------------------------
Ran 1 test in 0.001s

FAILED (failures=1)
Process finished with exit code 0
----

===== Using setUp and tearDown

The doc says : 

- setUp(): method called to prepare the test fixture. This is called immediately before calling the test method

-  tearDown(): method called immediately after the test method has been called and the result recorded. This is called even if the test method raised an exception

This is a stupid example because here setUp is sufficient but in more complex situation tearDown alows us to clean the thing after a test or to do whatever you want.

[source, python]
----
def f1(a, b):
    return a + b


class TestF1(unittest.TestCase):
    '''
    This class will test f1
    '''

    def setUp(self):
        self.good_value = 6

    def tearDown(self):
        self.good_value = 6

    def test_f1(self):
        res = f1(2, 4)
        self.assertEqual(res, self.good_value)

    def test_f1_with_bad_value(self):
        res = f1(2, 4)
        self.good_value = 3
        self.assertEqual(res, self.good_value)

if __name__ == '__main__':
    unittest.main()
----

The output : 

----
======================================================================
FAIL: test_f1_with_bad_value (tmp.TestF1)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\Users\rhz\PycharmProjects\untitled\tmp.py", line 23, in test_f1_with_bad_value
    self.assertEqual(res, self.good_value)
AssertionError: 6 != 3

----------------------------------------------------------------------
Ran 2 tests in 0.001s

FAILED (failures=1)

----
:hide-uri-scheme:
Url to the doc : https://docs.python.org/3/library/unittest.html#test-cases