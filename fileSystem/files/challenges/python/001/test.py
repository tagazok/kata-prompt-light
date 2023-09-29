import unittest
from app import sum

def test_sum():
    assertEqual(Maths(1, 2).sum(), 3)
    assertEqual(Maths(1, -1).sum(), 0)
    assertEqual(Maths(0, 0).sum(), 0)
    assertEqual(Maths(0, 1).sum(), 1)
    assertEqual(Maths(0, -1).sum(), -1)
    assertEqual(Maths(-1, 0).sum(), -1)
    assertEqual(Maths(-1, 10).sum(), 9)