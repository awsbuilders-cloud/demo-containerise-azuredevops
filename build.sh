#!/bin/sh

set -e

dotnet publish aspnetapp -c Release -f "netcoreapp3.1"
